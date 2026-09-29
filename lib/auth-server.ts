import { NextResponse } from "next/server";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getAdminApp, getAdminDb } from "@/lib/firebase-admin";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let adminAuthInstance: Auth | null = null;

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    adminAuthInstance = getAuth(getAdminApp());
  }
  return adminAuthInstance;
}

export async function requireUser(request: Request): Promise<{ uid: string; email: string | null }> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    throw new ApiError(401, "Unauthorized");
  }
}

export async function requireAdmin(
  request: Request
): Promise<{ uid: string; email: string | null }> {
  const user = await requireUser(request);
  const snap = await getAdminDb().collection("users").doc(user.uid).get();
  const role = snap.exists ? (snap.data()?.role as string | undefined) : undefined;
  if (role !== "admin") {
    throw new ApiError(403, "Forbidden");
  }
  return user;
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message, status: err.status }, { status: err.status });
  }
  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  return NextResponse.json({ error: message, status: 500 }, { status: 500 });
}
