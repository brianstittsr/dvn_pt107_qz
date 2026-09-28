import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").limit(100).get();

    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email ?? null,
        displayName: data.displayName ?? null,
        role: data.role ?? "user",
        subscriptionStatus: data.subscriptionStatus ?? "inactive",
        createdAt: data.createdAt?._seconds
          ? new Date(data.createdAt._seconds * 1000).toISOString()
          : null,
      };
    });

    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: message, status: 500 }, { status: 500 });
  }
}
