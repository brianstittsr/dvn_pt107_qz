import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { handleApiError, requireAdmin } from "@/lib/auth-server";
import type { PaymentRecord } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const snapshot = await getAdminDb()
      .collection("payments")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const payments = snapshot.docs.map((doc) => doc.data() as PaymentRecord);
    const summary = payments.reduce(
      (acc, p) => {
        if (p.status === "succeeded") {
          acc.totalCents += p.amountCents;
          acc.succeededCount += 1;
        } else if (p.status === "failed") {
          acc.failedCount += 1;
        } else if (p.status === "refunded") {
          acc.refundedCount += 1;
        }
        return acc;
      },
      { totalCents: 0, succeededCount: 0, failedCount: 0, refundedCount: 0 }
    );

    return NextResponse.json({ data: { payments, summary } }, { status: 200 });
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
