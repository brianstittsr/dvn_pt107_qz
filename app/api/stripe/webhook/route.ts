import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";
import { getPlan, type PlanId } from "@/lib/plans";
import type { PaymentRecord } from "@/lib/types";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function subscriptionPeriodEnd(subscription: Stripe.Subscription): string | null {
  const end = subscription.items.data[0]?.current_period_end;
  return typeof end === "number" ? new Date(end * 1000).toISOString() : null;
}

async function findUserIdByCustomer(customerId: string): Promise<string | null> {
  const snap = await getAdminDb()
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();
  return snap.empty ? null : snap.docs[0].id;
}

async function resolveUserId(opts: {
  metadataUserId?: string | null;
  clientReferenceId?: string | null;
  customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null;
}): Promise<string | null> {
  if (opts.metadataUserId) return opts.metadataUserId;
  if (opts.clientReferenceId) return opts.clientReferenceId;
  const customer = opts.customer;
  const customerId = typeof customer === "string" ? customer : customer?.id;
  if (customerId) return findUserIdByCustomer(customerId);
  return null;
}

function userRef(userId: string) {
  return getAdminDb().collection("users").doc(userId);
}

async function writePayment(record: PaymentRecord) {
  await getAdminDb().collection("payments").doc(record.id).set(record, { merge: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = await resolveUserId({
    metadataUserId: session.metadata?.userId,
    clientReferenceId: session.client_reference_id,
    customer: session.customer,
  });
  if (!userId) return;

  const planId = (session.metadata?.planId ?? null) as PlanId | null;
  const customerId =
    typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null);

  if (session.mode === "subscription" && session.subscription) {
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
    await userRef(userId).set(
      {
        subscriptionStatus: "active",
        subscriptionExpiry: subscriptionPeriodEnd(subscription),
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        planId,
        cancelAtPeriodEnd: false,
      },
      { merge: true }
    );
    return;
  }

  if (session.mode === "payment") {
    const plan = planId ? getPlan(planId) : null;
    const expiry = plan ? addMonths(new Date(), plan.durationMonths).toISOString() : null;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);
    await userRef(userId).set(
      {
        subscriptionStatus: "active",
        subscriptionExpiry: expiry,
        stripeCustomerId: customerId,
        stripeSubscriptionId: null,
        planId,
        cancelAtPeriodEnd: false,
      },
      { merge: true }
    );
    if (paymentIntentId) {
      await writePayment({
        id: paymentIntentId,
        userId,
        email: session.customer_details?.email ?? session.customer_email ?? null,
        planId,
        amountCents: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        status: "succeeded",
        kind: "one_time",
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        stripeInvoiceId: null,
        stripeSubscriptionId: null,
        paymentMethodType: session.payment_method_types?.[0] ?? null,
        createdAt: new Date().toISOString(),
      });
    }
  }
}

async function invoiceUserId(invoice: Stripe.Invoice): Promise<string | null> {
  const metaUserId = invoice.parent?.subscription_details?.metadata?.userId;
  if (metaUserId) return metaUserId;
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : (invoice.customer?.id ?? null);
  if (customerId) return findUserIdByCustomer(customerId);
  return null;
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const userId = await invoiceUserId(invoice);
  if (!userId) return;

  const subscriptionId = invoiceSubscriptionId(invoice);
  let subscription: Stripe.Subscription | null = null;
  if (subscriptionId) {
    subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  }

  await writePayment({
    id: invoice.id,
    userId,
    email: invoice.customer_email ?? null,
    planId: (subscription?.metadata?.planId ??
      invoice.parent?.subscription_details?.metadata?.planId ??
      null) as PlanId | null,
    amountCents: invoice.amount_paid ?? 0,
    currency: invoice.currency ?? "usd",
    status: "succeeded",
    kind: "subscription_invoice",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: null,
    stripeInvoiceId: invoice.id,
    stripeSubscriptionId: subscriptionId,
    paymentMethodType: null,
    createdAt: new Date().toISOString(),
  });

  await userRef(userId).set(
    {
      subscriptionStatus: "active",
      ...(subscription ? { subscriptionExpiry: subscriptionPeriodEnd(subscription) } : {}),
    },
    { merge: true }
  );
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const userId = await invoiceUserId(invoice);
  if (!userId) return;

  await writePayment({
    id: invoice.id,
    userId,
    email: invoice.customer_email ?? null,
    planId: (invoice.parent?.subscription_details?.metadata?.planId ?? null) as PlanId | null,
    amountCents: invoice.amount_due ?? 0,
    currency: invoice.currency ?? "usd",
    status: "failed",
    kind: "subscription_invoice",
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: null,
    stripeInvoiceId: invoice.id,
    stripeSubscriptionId: invoiceSubscriptionId(invoice),
    paymentMethodType: null,
    createdAt: new Date().toISOString(),
  });

  await userRef(userId).set({ subscriptionStatus: "past_due" }, { merge: true });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = await resolveUserId({
    metadataUserId: subscription.metadata?.userId,
    customer: subscription.customer,
  });
  if (!userId) return;

  const statusMap: Record<string, "active" | "past_due" | "canceled"> = {
    active: "active",
    trialing: "active",
    past_due: "past_due",
    canceled: "canceled",
    unpaid: "canceled",
    incomplete_expired: "canceled",
  };
  const mapped = statusMap[subscription.status];
  await userRef(userId).set(
    {
      ...(mapped ? { subscriptionStatus: mapped } : {}),
      subscriptionExpiry: subscriptionPeriodEnd(subscription),
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
    },
    { merge: true }
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = await resolveUserId({
    metadataUserId: subscription.metadata?.userId,
    customer: subscription.customer,
  });
  if (!userId) return;

  await userRef(userId).set(
    {
      subscriptionStatus: "canceled",
      cancelAtPeriodEnd: false,
      stripeSubscriptionId: null,
    },
    { merge: true }
  );
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : (charge.payment_intent?.id ?? null);
  if (!paymentIntentId) return;
  await getAdminDb()
    .collection("payments")
    .doc(paymentIntentId)
    .set({ status: "refunded" }, { merge: true });
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, getStripeWebhookSecret());
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    return NextResponse.json({ error: message, status: 400 }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message, status: 500 }, { status: 500 });
  }
}
