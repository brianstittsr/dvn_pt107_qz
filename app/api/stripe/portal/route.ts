import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";
import { ApiError, handleApiError, requireUser } from "@/lib/auth-server";
import type { UserProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { uid } = await requireUser(request);
    const snap = await getAdminDb().collection("users").doc(uid).get();
    const profile = (snap.exists ? snap.data() : {}) as Partial<UserProfile>;

    if (!profile.stripeCustomerId) {
      throw new ApiError(400, "No billing account found");
    }

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const session = await getStripe().billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ data: { url: session.url } }, { status: 200 });
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
