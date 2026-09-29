# Part 107 Flight School

A Next.js study app for the FAA Part 107 Remote Pilot certification.

## Features

- Realistic quiz questions across all FAA Part 107 knowledge areas
- Vocabulary flashcards with category filters and shuffle
- Dashboard with accuracy, streak, weakest area, and readiness score
- Progress tracking by category
- Optional account creation to sync progress across devices
- Pro subscription via Stripe for cloud sync, full quiz history, and analytics

## Tech stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI components:** Custom components based on shadcn/ui patterns
- **Auth & database:** Firebase Authentication + Firestore
- **Payments:** Stripe Checkout + webhooks
- **State:** Zustand + localStorage

## Getting started

1. Copy `env.example` to `.env.local` and fill in your Firebase and Stripe credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Stripe setup

Create three Prices in the Stripe Dashboard:

- **Monthly** — recurring, $97/mo → `STRIPE_PRICE_MONTHLY`
- **6-Month Mission** — one-time, $497 → `STRIPE_PRICE_6MO`
- **12-Month Deployment** — one-time, $897 → `STRIPE_PRICE_12MO`

The discounted plans are one-time prepaid access because Stripe's BNPL methods
(Klarna, Affirm, Afterpay) only support one-time payments.

Then:

- Enable **Klarna, Affirm, and Afterpay** under Settings → Payment methods (Stripe will
  offer them automatically on one-time checkout sessions).
- Configure the **Customer Portal** (Settings → Billing → Customer portal) so "Manage
  billing" works.
- Point a webhook at `/api/stripe/webhook` with these events:
  `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`,
  `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`.

## Important

This is a study aid, not a substitute for the current FAA regulations, Remote Pilot Study Guide,
Airman Certification Standards, or official FAA guidance. Review the official references before
operating.
