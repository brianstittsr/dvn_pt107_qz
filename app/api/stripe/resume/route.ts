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
      throw new ApiError(400, "No active subscription to resume");
    }

    await getStripe().subscriptions.update(profile.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
    await userRef.set({ cancelAtPeriodEnd: false }, { merge: true });

    return NextResponse.json(
      { data: { cancelAtPeriodEnd: false, subscriptionExpiry: profile.subscriptionExpiry ?? null } },
      { status: 200 }
    );
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
