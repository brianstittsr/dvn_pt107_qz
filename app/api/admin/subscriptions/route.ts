import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { handleApiError, requireAdmin } from "@/lib/auth-server";

interface SubscriptionRow {
  uid: string;
  email: string | null;
  displayName: string | null;
  planId: string | null;
  subscriptionStatus: string;
  subscriptionExpiry: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();

    const [activeSnap, plannedSnap] = await Promise.all([
      db.collection("users").where("subscriptionStatus", "!=", "inactive").get(),
      db.collection("users").where("planId", "!=", null).get(),
    ]);

    const rows = new Map<string, SubscriptionRow>();
    for (const doc of [...activeSnap.docs, ...plannedSnap.docs]) {
      const data = doc.data();
      rows.set(doc.id, {
        uid: doc.id,
        email: data.email ?? null,
        displayName: data.displayName ?? null,
        planId: data.planId ?? null,
        subscriptionStatus: data.subscriptionStatus ?? "inactive",
        subscriptionExpiry: data.subscriptionExpiry ?? null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
        stripeCustomerId: data.stripeCustomerId ?? null,
        stripeSubscriptionId: data.stripeSubscriptionId ?? null,
      });
    }

    return NextResponse.json({ data: [...rows.values()] }, { status: 200 });
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
