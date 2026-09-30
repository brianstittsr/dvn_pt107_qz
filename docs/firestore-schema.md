# Firestore Schema — Part 107 Quiz

Data model for student progress tracking and Stripe billing. All timestamps
are stored as **ISO-8601 strings** (server/webhook writes use
`new Date().toISOString()`; only `users[].createdAt` uses Firestore
`serverTimestamp()` on the client-side create path).

Written by:
- **Client SDK** — `users/{uid}` profile creation on first sign-in only
- **Firebase Admin SDK** — everything else (API routes, Stripe webhook)

---

## Collections

```
users/{uid}                            top-level user doc (profile + billing state)
users/{uid}/quizSessions/{sessionId}   per-student completed quiz sessions
payments/{docId}                       top-level payment ledger (webhook-written)
```

### `users/{uid}` — UserProfile

| Field | Type | Default | Written by | Notes |
|---|---|---|---|---|
| `uid` | string | auth uid | client (create) | Doc ID = Firebase Auth UID |
| `email` | string \| null | from auth | client/webhook | |
| `displayName` | string \| null | from auth | client/checkout | Filled from registration `fullName` if empty |
| `photoURL` | string \| null | from auth | client | |
| `role` | `"user" \| "admin"` | `"user"` | manual (Console) | Set `admin` via Firestore Console; never trusted from the client |
| `subscriptionStatus` | `"inactive" \| "active" \| "canceled" \| "past_due"` | `"inactive"` | webhook/admin API | `past_due` on `invoice.payment_failed` |
| `subscriptionExpiry` | ISO string \| null | `null` | webhook/admin API | Monthly: subscription `current_period_end`. Prepaid: `checkout + durationMonths` |
| `stripeCustomerId` | string \| null | `null` | checkout | Created once, reused thereafter |
| `stripeSubscriptionId` | string \| null | `null` | webhook | Only for `mode:"subscription"` (monthly); `null` for prepaid |
| `planId` | `"monthly" \| "sixMonth" \| "annual" \| null` | `null` | webhook/admin API | See `lib/plans.ts` |
| `cancelAtPeriodEnd` | boolean | `false` | webhook/cancel/resume API | Monthly only |
| `registration` | StudentRegistration \| null | `null` | checkout | See below |
| `createdAt` | Firestore Timestamp | now | client (create) | `serverTimestamp()` |

#### `registration` — StudentRegistration

| Field | Type | Notes |
|---|---|---|
| `fullName` | string | ≥ 2 chars |
| `email` | string | |
| `phone` | string | ≥ 7 digits after stripping non-digits |
| `city` | string | |
| `state` | string | 2-letter US code (see `US_STATES` in `lib/schemas.ts`) |
| `experience` | `"none" \| "hobbyist" \| "some_commercial" \| "military" \| "professional"` | |
| `targetExamDate` | ISO date string \| null | optional |
| `referralSource` | `"search" \| "social" \| "friend" \| "military_unit" \| "employer" \| "other"` | |
| `createdAt` | ISO string | set at checkout submission |

### `users/{uid}/quizSessions/{sessionId}` — QuizSession

Written by `POST /api/sync` (Admin SDK). Doc ID = client-generated session ID → idempotent re-syncs.

| Field | Type | Notes |
|---|---|---|
| `id` | string | same as doc ID |
| `userId` | string | parent uid |
| `startedAt` | ISO string | |
| `completedAt` | ISO string | |
| `categoryId` | `"all" \| category id` | `lib/data.ts` categories |
| `questionCount` | number | |
| `score` | number | |
| `items` | QuizSessionItem[] | per-question results (see below) |
| `syncedAt` | ISO string | added by the sync route |

`QuizSessionItem`: `{ questionId, categoryId, selectedIndex, correctIndex, correct, answeredAt }`.

> **Note on live stats:** aggregate progress (`answered`, `correct`, `streak`,
> `lastActivityDate`, `knownVocab`, `byCategory` — `UserStats` in `lib/types.ts`)
> currently lives in **localStorage via Zustand** (`part107-study-state` key).
> `quizSessions` is the only durable per-student progress record today. If you
> want server-side cross-device stats, write a `users/{uid}` `stats` map field
> from the sync route (recommended addition, not yet implemented).

### `payments/{docId}` — PaymentRecord

Written **only** by the Stripe webhook (`app/api/stripe/webhook/route.ts`).
Doc ID = Stripe object ID (`payment_intent` for one-time checkouts,
`invoice` for subscription invoices) → webhook retries are idempotent.

| Field | Type | Notes |
|---|---|---|
| `id` | string | `pi_…` or `in_…` — same as doc ID |
| `userId` | string | resolved via metadata → `client_reference_id` → `stripeCustomerId` lookup |
| `email` | string \| null | customer email at payment time |
| `planId` | PlanId \| null | |
| `amountCents` | number | e.g. `9700`, `49700`, `89700` |
| `currency` | string | `"usd"` |
| `status` | `"succeeded" \| "failed" \| "refunded" \| "pending"` | refunded set by `charge.refunded` |
| `kind` | `"one_time" \| "subscription_invoice"` | one_time = 6/12-month prepaid (BNPL-eligible) |
| `stripeCheckoutSessionId` | string \| null | `cs_…` for one-time |
| `stripePaymentIntentId` | string \| null | `pi_…` |
| `stripeInvoiceId` | string \| null | `in_…` |
| `stripeSubscriptionId` | string \| null | `sub_…` for monthly |
| `paymentMethodType` | string \| null | `card`, `klarna`, `affirm`, `afterpay` |
| `createdAt` | ISO string | |

---

## Billing lifecycle (event → field updates)

| Stripe event | `users/{uid}` updates | `payments` writes |
|---|---|---|
| `checkout.session.completed` (subscription) | `active`, expiry = `items[0].current_period_end`, `stripeSubscriptionId`, `planId`, `cancelAtPeriodEnd=false` | — |
| `checkout.session.completed` (payment) | `active`, expiry = now + `durationMonths`, `planId` | `payments/{pi_}` succeeded, one_time |
| `invoice.paid` | `active`, refresh expiry | `payments/{in_}` succeeded |
| `invoice.payment_failed` | `past_due` | `payments/{in_}` failed |
| `customer.subscription.updated` | status map, expiry, `cancelAtPeriodEnd` | — |
| `customer.subscription.deleted` | `canceled`, `cancelAtPeriodEnd=false`, `stripeSubscriptionId=null` | — |
| `charge.refunded` | — | matching record → `refunded` |

Admin overrides via `POST /api/admin/subscriptions/[uid]`: `cancel`,
`resume`, `revoke` (immediate `inactive` + Stripe cancel), `grant` (comped
access for `plan.durationMonths`).

---

## Queries in use → indexes

| Query | Where | Index needed |
|---|---|---|
| `users where stripeCustomerId == ?` | webhook | auto (single field) |
| `users orderBy createdAt desc` | `/api/admin/users` | auto |
| `users where subscriptionStatus != "inactive"` | `/api/admin/subscriptions` | auto |
| `users where planId != null` | `/api/admin/subscriptions` | auto |
| `payments where status == "succeeded"` | `/api/admin/overview` | auto |
| `payments orderBy createdAt desc` | `/api/admin/payments` | auto |
| `collectionGroup("quizSessions")` | `/api/admin/overview` | auto |

No composite indexes are required — `firestore.indexes.json` ships empty.
All Admin-SDK queries bypass security rules; rules only constrain the client
SDK (`firestore.rules`).

## Security rules summary (see `firestore.rules`)

- `users/{uid}`: readable by the owner; creatable by the owner with
  `role`/`subscription*`/`stripe*`/`planId` locked to defaults; billing
  fields are **never client-updatable** (webhook/Admin SDK only).
- `quizSessions`: owner read+create only (sync writes go through Admin SDK,
  which ignores rules).
- `payments`: readable by the owning user (`resource.data.userId`); never
  client-writeable.
- Admin data (other users, all payments) is served exclusively through the
  `requireAdmin`-guarded API routes — no client-side admin reads.
