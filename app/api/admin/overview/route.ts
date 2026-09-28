import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const [usersSnap, sessionsSnap] = await Promise.all([
      db.collection("users").get(),
      db.collectionGroup("quizSessions").get(),
    ]);

    const users = usersSnap.docs.map((doc) => doc.data());
    const activeSubscriptions = users.filter((u) => u.subscriptionStatus === "active").length;

    return NextResponse.json(
      {
        data: {
          totalUsers: usersSnap.size,
          activeSubscriptions,
          freeUsers: usersSnap.size - activeSubscriptions,
          totalQuizSessions: sessionsSnap.size,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch overview";
    return NextResponse.json({ error: message, status: 500 }, { status: 500 });
  }
}
