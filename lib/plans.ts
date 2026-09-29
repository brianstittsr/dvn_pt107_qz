export type PlanId = "monthly" | "sixMonth" | "annual";

export interface Plan {
  id: PlanId;
  name: string;
  priceCents: number;
  mode: "subscription" | "payment";
  durationMonths: number;
  badge?: string;
  perMonthCents: number;
  description: string;
  bnpl: boolean;
  priceEnv: string;
}

export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Month-to-Month",
    priceCents: 9700,
    mode: "subscription",
    durationMonths: 1,
    perMonthCents: 9700,
    description: "Cancel anytime. Card only.",
    bnpl: false,
    priceEnv: "STRIPE_PRICE_MONTHLY",
  },
  {
    // Stripe's BNPL methods (Klarna/Affirm/Afterpay) only support one-time
    // payments, so the discounted plans are one-time prepaid access, not
    // recurring subscriptions.
    id: "sixMonth",
    name: "6-Month Mission",
    priceCents: 49700,
    mode: "payment",
    durationMonths: 6,
    badge: "Save 15%",
    perMonthCents: Math.round(49700 / 6),
    description: "Pay once. Card or Buy Now, Pay Later.",
    bnpl: true,
    priceEnv: "STRIPE_PRICE_6MO",
  },
  {
    // Stripe's BNPL methods (Klarna/Affirm/Afterpay) only support one-time
    // payments, so the discounted plans are one-time prepaid access, not
    // recurring subscriptions.
    id: "annual",
    name: "12-Month Deployment",
    priceCents: 89700,
    mode: "payment",
    durationMonths: 12,
    badge: "Best value — save 23%",
    perMonthCents: Math.round(89700 / 12),
    description: "Pay once. Card or Buy Now, Pay Later.",
    bnpl: true,
    priceEnv: "STRIPE_PRICE_12MO",
  },
];

export function getPlan(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) {
    throw new Error(`Unknown plan: ${id}`);
  }
  return plan;
}

export function getPlanPriceId(id: PlanId): string {
  const plan = getPlan(id);
  const priceId = process.env[plan.priceEnv] ?? (id === "monthly" ? process.env.STRIPE_PRICE_ID : undefined);
  if (!priceId) {
    throw new Error(
      `${plan.priceEnv} is not configured${id === "monthly" ? " (or legacy STRIPE_PRICE_ID)" : ""}`
    );
  }
  return priceId;
}
