import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { QuizSession } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { userId?: string; session?: QuizSession };
    const { userId, session } = body;

    if (!userId || !session) {
      return NextResponse.json({ error: "Missing userId or session", status: 400 }, { status: 400 });
    }

    const docRef = getAdminDb()
      .collection("users")
      .doc(userId)
      .collection("quizSessions")
      .doc(session.id);

    await docRef.set({
      ...session,
      syncedAt: new Date().toISOString(),
    });

    return NextResponse.json({ data: { id: session.id } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message, status: 500 }, { status: 500 });
  }
}
