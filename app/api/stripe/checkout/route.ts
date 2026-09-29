import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";
import { handleApiError, requireUser } from "@/lib/auth-server";
import { getPlan, getPlanPriceId } from "@/lib/plans";
import { checkoutRequestSchema } from "@/lib/schemas";
import type { UserProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { uid } = await requireUser(request);

    const body: unknown = await request.json();
    const parsed = checkoutRequestSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid request";
      return NextResponse.json({ error: message, status: 400 }, { status: 400 });
    }
    const { planId, registration } = parsed.data;
    const plan = getPlan(planId);

    const db = getAdminDb();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const profile = (userSnap.exists ? userSnap.data() : {}) as Partial<UserProfile>;

    const stripe = getStripe();
    let stripeCustomerId = profile.stripeCustomerId ?? null;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: registration.email,
        name: registration.fullName,
        phone: registration.phone,
        metadata: { userId: uid },
      });
      stripeCustomerId = customer.id;
    }

    await userRef.set(
      {
        stripeCustomerId,
        registration: { ...registration, createdAt: new Date().toISOString() },
        ...(profile.displayName ? {} : { displayName: registration.fullName }),
      },
      { merge: true }
    );

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      customer: stripeCustomerId,
      line_items: [{ price: getPlanPriceId(planId), quantity: 1 }],
      client_reference_id: uid,
      metadata: { userId: uid, planId },
      ...(plan.mode === "subscription"
        ? { subscription_data: { metadata: { userId: uid, planId } } }
        : { payment_intent_data: { metadata: { userId: uid, planId } } }),
      success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/activate?checkout=cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ data: { url: session.url } }, { status: 200 });
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
