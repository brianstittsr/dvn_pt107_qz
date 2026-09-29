import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { handleApiError, requireAdmin } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
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
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
