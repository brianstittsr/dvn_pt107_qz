import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";
import { ApiError, handleApiError, requireUser } from "@/lib/auth-server";
import type { UserProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { uid } = await requireUser(request);
    const userRef = getAdminDb().collection("users").doc(uid);
    const snap = await userRef.get();
    const profile = (snap.exists ? snap.data() : {}) as Partial<UserProfile>;

    if (!profile.stripeSubscriptionId) {
      const expiry = profile.subscriptionExpiry
        ? new Date(profile.subscriptionExpiry).toLocaleDateString()
        : "its end date";
      throw new ApiError(400, `Prepaid plans don't renew; access ends on ${expiry}`);
    }

    await getStripe().subscriptions.update(profile.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    await userRef.set({ cancelAtPeriodEnd: true }, { merge: true });

    return NextResponse.json(
      { data: { cancelAtPeriodEnd: true, subscriptionExpiry: profile.subscriptionExpiry ?? null } },
      { status: 200 }
    );
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
