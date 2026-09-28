import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";

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
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId ?? session.client_reference_id;
      if (userId) {
        const subscription = (await getStripe().subscriptions.retrieve(
          session.subscription as string
        )) as unknown as { id: string; current_period_end: number };
        await getAdminDb().collection("users").doc(userId).update({
          subscriptionStatus: "active",
          subscriptionExpiry: new Date(subscription.current_period_end * 1000).toISOString(),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
        });
      }
    }

    if (event.type === "invoice.payment_failed" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await getAdminDb().collection("users").doc(userId).update({
          subscriptionStatus: "inactive",
          subscriptionExpiry: null,
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message, status: 500 }, { status: 500 });
  }
}
