import { getPlan, type PlanId } from "@/lib/plans";
import type { PaymentRecord } from "@/lib/types";

/**
 * Demo/preview mode. Set NEXT_PUBLIC_DEMO_ENABLED="false" to hide the demo
 * bypass on /login and ignore any persisted demo session.
 */
export const DEMO_ENABLED = process.env.NEXT_PUBLIC_DEMO_ENABLED !== "false";

/** Shape returned by GET /api/admin/users. */
export interface DemoUserRecord {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  subscriptionStatus: string;
  createdAt?: string;
}

/** Shape returned by GET /api/admin/subscriptions. */
export interface DemoSubscriptionRow {
  uid: string;
  email: string | null;
  displayName: string | null;
  planId: PlanId | null;
  subscriptionStatus: string;
  subscriptionExpiry: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

/** Shape returned by GET /api/admin/payments. */
export interface DemoPaymentsData {
  payments: PaymentRecord[];
  summary: {
    totalCents: number;
    succeededCount: number;
    failedCount: number;
    refundedCount: number;
  };
}

/** Shape returned by GET /api/admin/overview. */
export interface DemoOverviewStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalQuizSessions: number;
  freeUsers: number;
  revenueCents: number;
  pastDueUsers: number;
}

export const DEMO_USERS: DemoUserRecord[] = [
  {
    uid: "u-whitaker",
    email: "t.whitaker@proton.me",
    displayName: "T. Whitaker",
    role: "admin",
    subscriptionStatus: "active",
    createdAt: "2025-08-02T09:14:00.000Z",
  },
  {
    uid: "u-sanders",
    email: "j.sanders@outlook.com",
    displayName: "J. Sanders",
    role: "user",
    subscriptionStatus: "active",
    createdAt: "2025-09-14T16:40:00.000Z",
  },
  {
    uid: "u-reyes",
    email: "m.reyes83@gmail.com",
    displayName: "M. Reyes",
    role: "user",
    subscriptionStatus: "active",
    createdAt: "2025-09-28T11:05:00.000Z",
  },
  {
    uid: "u-kowalski",
    email: "d.kowalski@icloud.com",
    displayName: "D. Kowalski",
    role: "user",
    subscriptionStatus: "past_due",
    createdAt: "2025-10-11T19:22:00.000Z",
  },
  {
    uid: "u-ferreira",
    email: "a.ferreira@outlook.com",
    displayName: "A. Ferreira",
    role: "user",
    subscriptionStatus: "inactive",
    createdAt: "2025-10-30T08:47:00.000Z",
  },
  {
    uid: "u-callahan",
    email: "r.callahan47@gmail.com",
    displayName: "R. Callahan",
    role: "user",
    subscriptionStatus: "active",
    createdAt: "2025-11-05T13:31:00.000Z",
  },
  {
    uid: "u-okafor",
    email: "s.okafor@yahoo.com",
    displayName: "S. Okafor",
    role: "user",
    subscriptionStatus: "inactive",
    createdAt: "2025-11-18T17:58:00.000Z",
  },
  {
    uid: "u-hartman",
    email: "b.hartman@gmail.com",
    displayName: "B. Hartman",
    role: "user",
    subscriptionStatus: "past_due",
    createdAt: "2025-11-21T20:12:00.000Z",
  },
];

export const DEMO_SUBSCRIPTIONS: DemoSubscriptionRow[] = [
  {
    uid: "u-sanders",
    email: "j.sanders@outlook.com",
    displayName: "J. Sanders",
    planId: "monthly",
    subscriptionStatus: "active",
    subscriptionExpiry: "2026-04-02T14:32:00.000Z",
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_demo_sanders",
    stripeSubscriptionId: "sub_demo_sanders",
  },
  {
    uid: "u-reyes",
    email: "m.reyes83@gmail.com",
    displayName: "M. Reyes",
    planId: "sixMonth",
    subscriptionStatus: "active",
    subscriptionExpiry: "2026-05-05T11:05:00.000Z",
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_demo_reyes",
    stripeSubscriptionId: null,
  },
  {
    uid: "u-whitaker",
    email: "t.whitaker@proton.me",
    displayName: "T. Whitaker",
    planId: "annual",
    subscriptionStatus: "active",
    subscriptionExpiry: "2026-10-09T09:14:00.000Z",
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_demo_whitaker",
    stripeSubscriptionId: null,
  },
  {
    uid: "u-kowalski",
    email: "d.kowalski@icloud.com",
    displayName: "D. Kowalski",
    planId: "monthly",
    subscriptionStatus: "past_due",
    subscriptionExpiry: "2026-03-28T19:22:00.000Z",
    cancelAtPeriodEnd: true,
    stripeCustomerId: "cus_demo_kowalski",
    stripeSubscriptionId: "sub_demo_kowalski",
  },
  {
    uid: "u-callahan",
    email: "r.callahan47@gmail.com",
    displayName: "R. Callahan",
    planId: "annual",
    subscriptionStatus: "active",
    subscriptionExpiry: "2026-11-12T13:31:00.000Z",
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_demo_callahan",
    stripeSubscriptionId: null,
  },
  {
    uid: "u-okafor",
    email: "s.okafor@yahoo.com",
    displayName: "S. Okafor",
    planId: "sixMonth",
    subscriptionStatus: "canceled",
    subscriptionExpiry: "2025-12-15T17:58:00.000Z",
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_demo_okafor",
    stripeSubscriptionId: null,
  },
  {
    uid: "u-hartman",
    email: "b.hartman@gmail.com",
    displayName: "B. Hartman",
    planId: "monthly",
    subscriptionStatus: "past_due",
    subscriptionExpiry: "2026-03-26T20:12:00.000Z",
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_demo_hartman",
    stripeSubscriptionId: "sub_demo_hartman",
  },
];

const DEMO_PAYMENT_ROWS: PaymentRecord[] = [
  {
    id: "pay_demo_010",
    userId: "u-hartman",
    email: "b.hartman@gmail.com",
    planId: "monthly",
    amountCents: 9700,
    currency: "usd",
    status: "succeeded",
    kind: "subscription_invoice",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: "pi_demo_010",
    stripeInvoiceId: "in_demo_010",
    stripeSubscriptionId: "sub_demo_hartman",
    paymentMethodType: "card",
    createdAt: "2025-11-26T20:15:00.000Z",
  },
  {
    id: "pay_demo_009",
    userId: "u-kowalski",
    email: "d.kowalski@icloud.com",
    planId: "monthly",
    amountCents: 9700,
    currency: "usd",
    status: "failed",
    kind: "subscription_invoice",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: "pi_demo_009",
    stripeInvoiceId: "in_demo_009",
    stripeSubscriptionId: "sub_demo_kowalski",
    paymentMethodType: "card",
    createdAt: "2025-11-22T06:03:00.000Z",
  },
  {
    id: "pay_demo_008",
    userId: "u-hartman",
    email: "b.hartman@gmail.com",
    planId: "monthly",
    amountCents: 9700,
    currency: "usd",
    status: "succeeded",
    kind: "subscription_invoice",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: "pi_demo_008",
    stripeInvoiceId: "in_demo_008",
    stripeSubscriptionId: "sub_demo_hartman",
    paymentMethodType: "card",
    createdAt: "2025-11-19T20:11:00.000Z",
  },
  {
    id: "pay_demo_007",
    userId: "u-okafor",
    email: "s.okafor@yahoo.com",
    planId: "sixMonth",
    amountCents: 49700,
    currency: "usd",
    status: "refunded",
    kind: "one_time",
    stripeCheckoutSessionId: "cs_demo_007",
    stripePaymentIntentId: "pi_demo_007",
    stripeInvoiceId: null,
    stripeSubscriptionId: null,
    paymentMethodType: "card",
    createdAt: "2025-11-15T17:55:00.000Z",
  },
  {
    id: "pay_demo_006",
    userId: "u-callahan",
    email: "r.callahan47@gmail.com",
    planId: "annual",
    amountCents: 89700,
    currency: "usd",
    status: "succeeded",
    kind: "one_time",
    stripeCheckoutSessionId: "cs_demo_006",
    stripePaymentIntentId: "pi_demo_006",
    stripeInvoiceId: null,
    stripeSubscriptionId: null,
    paymentMethodType: "afterpay",
    createdAt: "2025-11-12T13:30:00.000Z",
  },
  {
    id: "pay_demo_005",
    userId: "u-ferreira",
    email: "a.ferreira@outlook.com",
    planId: "sixMonth",
    amountCents: 49700,
    currency: "usd",
    status: "failed",
    kind: "one_time",
    stripeCheckoutSessionId: "cs_demo_005",
    stripePaymentIntentId: null,
    stripeInvoiceId: null,
    stripeSubscriptionId: null,
    paymentMethodType: "affirm",
    createdAt: "2025-11-08T08:45:00.000Z",
  },
  {
    id: "pay_demo_004",
    userId: "u-sanders",
    email: "j.sanders@outlook.com",
    planId: "monthly",
    amountCents: 9700,
    currency: "usd",
    status: "succeeded",
    kind: "subscription_invoice",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: "pi_demo_004",
    stripeInvoiceId: "in_demo_004",
    stripeSubscriptionId: "sub_demo_sanders",
    paymentMethodType: "card",
    createdAt: "2025-11-02T14:35:00.000Z",
  },
  {
    id: "pay_demo_003",
    userId: "u-whitaker",
    email: "t.whitaker@proton.me",
    planId: "annual",
    amountCents: 89700,
    currency: "usd",
    status: "succeeded",
    kind: "one_time",
    stripeCheckoutSessionId: "cs_demo_003",
    stripePaymentIntentId: "pi_demo_003",
    stripeInvoiceId: null,
    stripeSubscriptionId: null,
    paymentMethodType: "card",
    createdAt: "2025-10-09T09:20:00.000Z",
  },
  {
    id: "pay_demo_002",
    userId: "u-reyes",
    email: "m.reyes83@gmail.com",
    planId: "sixMonth",
    amountCents: 49700,
    currency: "usd",
    status: "succeeded",
    kind: "one_time",
    stripeCheckoutSessionId: "cs_demo_002",
    stripePaymentIntentId: "pi_demo_002",
    stripeInvoiceId: null,
    stripeSubscriptionId: null,
    paymentMethodType: "klarna",
    createdAt: "2025-10-05T11:02:00.000Z",
  },
  {
    id: "pay_demo_001",
    userId: "u-sanders",
    email: "j.sanders@outlook.com",
    planId: "monthly",
    amountCents: 9700,
    currency: "usd",
    status: "succeeded",
    kind: "subscription_invoice",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: "pi_demo_001",
    stripeInvoiceId: "in_demo_001",
    stripeSubscriptionId: "sub_demo_sanders",
    paymentMethodType: "card",
    createdAt: "2025-10-02T14:32:00.000Z",
  },
];

const DEMO_PAYMENT_SUMMARY = DEMO_PAYMENT_ROWS.reduce(
  (acc, p) => {
    if (p.status === "succeeded") {
      acc.totalCents += p.amountCents;
      acc.succeededCount += 1;
    } else if (p.status === "failed") {
      acc.failedCount += 1;
    } else if (p.status === "refunded") {
      acc.refundedCount += 1;
    }
    return acc;
  },
  { totalCents: 0, succeededCount: 0, failedCount: 0, refundedCount: 0 }
);

export const DEMO_PAYMENTS: DemoPaymentsData = {
  payments: DEMO_PAYMENT_ROWS,
  summary: DEMO_PAYMENT_SUMMARY,
};

export const DEMO_OVERVIEW: DemoOverviewStats = {
  totalUsers: 128,
  activeSubscriptions: 34,
  totalQuizSessions: 412,
  freeUsers: 94,
  revenueCents: DEMO_PAYMENT_SUMMARY.totalCents,
  pastDueUsers: 2,
};

/**
 * Optimistically apply a subscription admin action to demo rows.
 * Mirrors POST /api/admin/subscriptions/[uid] without touching the network.
 * Kept at module scope so it can call Date.now() (impure) outside render.
 */
export function applyDemoSubscriptionAction(
  rows: DemoSubscriptionRow[],
  uid: string,
  action: string,
  planId?: PlanId
): DemoSubscriptionRow[] {
  const grantExpiry =
    action === "grant" && planId
      ? new Date(
          Date.now() + getPlan(planId).durationMonths * 30 * 24 * 60 * 60 * 1000
        ).toISOString()
      : null;

  return rows.map((row) => {
    if (row.uid !== uid) return row;
    if (action === "cancel") {
      return { ...row, cancelAtPeriodEnd: true };
    }
    if (action === "resume") {
      return { ...row, cancelAtPeriodEnd: false };
    }
    if (action === "revoke") {
      return { ...row, subscriptionStatus: "inactive", cancelAtPeriodEnd: false };
    }
    if (action === "grant" && planId && grantExpiry) {
      return {
        ...row,
        planId,
        subscriptionStatus: "active",
        subscriptionExpiry: grantExpiry,
        cancelAtPeriodEnd: false,
      };
    }
    return row;
  });
}
