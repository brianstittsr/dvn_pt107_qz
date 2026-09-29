import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";
import { ApiError, handleApiError, requireAdmin } from "@/lib/auth-server";
import { adminSubscriptionActionSchema } from "@/lib/schemas";
import { getPlan } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";
import type { UserProfile } from "@/lib/types";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    await requireAdmin(request);
    const { uid } = await params;

    const body: unknown = await request.json();
    const parsed = adminSubscriptionActionSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid request";
      return NextResponse.json({ error: message, status: 400 }, { status: 400 });
    }
    const { action, planId } = parsed.data;

    const userRef = getAdminDb().collection("users").doc(uid);
    const snap = await userRef.get();
    const profile = (snap.exists ? snap.data() : {}) as Partial<UserProfile>;
    const stripe = getStripe();

    switch (action) {
      case "cancel": {
        if (!profile.stripeSubscriptionId) {
          throw new ApiError(400, "User has no Stripe subscription");
        }
        await stripe.subscriptions.update(profile.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
        await userRef.set({ cancelAtPeriodEnd: true }, { merge: true });
        break;
      }
      case "resume": {
        if (!profile.stripeSubscriptionId) {
          throw new ApiError(400, "User has no Stripe subscription");
        }
        await stripe.subscriptions.update(profile.stripeSubscriptionId, {
          cancel_at_period_end: false,
        });
        await userRef.set({ cancelAtPeriodEnd: false }, { merge: true });
        break;
      }
      case "revoke": {
        if (profile.stripeSubscriptionId) {
          await stripe.subscriptions.cancel(profile.stripeSubscriptionId);
        }
        await userRef.set(
          {
            subscriptionStatus: "inactive",
            subscriptionExpiry: null,
            cancelAtPeriodEnd: false,
            stripeSubscriptionId: null,
          },
          { merge: true }
        );
        break;
      }
      case "grant": {
        if (!planId) {
          throw new ApiError(400, "planId is required for grant");
        }
        const plan = getPlan(planId as PlanId);
        await userRef.set(
          {
            subscriptionStatus: "active",
            planId,
            subscriptionExpiry: addMonths(new Date(), plan.durationMonths).toISOString(),
            cancelAtPeriodEnd: false,
          },
          { merge: true }
        );
        break;
      }
    }

    const updated = await userRef.get();
    return NextResponse.json({ data: updated.data() ?? {} }, { status: 200 });
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
