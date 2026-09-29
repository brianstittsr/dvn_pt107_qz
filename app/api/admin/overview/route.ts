import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { handleApiError, requireAdmin } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const db = getAdminDb();
    const [usersSnap, sessionsSnap, paymentsSnap] = await Promise.all([
      db.collection("users").get(),
      db.collectionGroup("quizSessions").get(),
      db.collection("payments").where("status", "==", "succeeded").get(),
    ]);

    const users = usersSnap.docs.map((doc) => doc.data());
    const activeSubscriptions = users.filter((u) => u.subscriptionStatus === "active").length;
    const pastDueUsers = users.filter((u) => u.subscriptionStatus === "past_due").length;
    const revenueCents = paymentsSnap.docs.reduce(
      (sum, doc) => sum + (doc.data().amountCents ?? 0),
      0
    );

    return NextResponse.json(
      {
        data: {
          totalUsers: usersSnap.size,
          activeSubscriptions,
          freeUsers: usersSnap.size - activeSubscriptions,
          totalQuizSessions: sessionsSnap.size,
          revenueCents,
          pastDueUsers,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
