import { NextRequest, NextResponse } from "next/server";
import { getStripe, getStripePriceId } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = (await request.json()) as { userId?: string; email?: string | null };
    if (!userId) {
      return NextResponse.json({ error: "Missing userId", status: 400 }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const priceId = getStripePriceId();

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/activate?checkout=cancel`,
      client_reference_id: userId,
      customer_email: email ?? undefined,
      metadata: { userId },
    });

    return NextResponse.json({ data: { url: session.url } }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Checkout session creation failed";
    return NextResponse.json({ error: message, status: 500 }, { status: 500 });
  }
}
