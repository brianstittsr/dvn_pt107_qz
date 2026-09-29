"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsigniaBadge } from "@/components/military";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";

const features = [
  "Cloud sync across devices",
  "Full quiz history and analytics",
  "Weak-area insights",
  "Priority updates and new questions",
];

export default function ActivatePage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to activate Pro.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.error) {
        toast.error(data.error);
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not start checkout.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const isActive = profile?.subscriptionStatus === "active";

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-12 text-center">
      <div>
        <h1 className="stencil text-4xl tracking-tight text-olive-dark">Go Pro</h1>
        <p className="mt-3 text-lg text-olive-dark/70">
          Support the mission and unlock powerful study tools.
        </p>
      </div>

      <Card className="relative mx-auto max-w-md overflow-hidden pt-2 text-left">
        <div className="hazard-stripe absolute inset-x-0 top-0" aria-hidden="true" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl text-olive-dark">Part 107 Pro</CardTitle>
            <InsigniaBadge variant="pro">Pro</InsigniaBadge>
          </div>
          <p className="text-sm text-olive-dark/60">Subscription · cancel anytime</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-4xl font-bold text-foreground">
            $97<span className="text-lg font-normal text-olive-dark/60">/mo</span>
          </div>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-olive-dark/80">
                <Check className="mt-0.5 h-4 w-4 text-olive" />
                {feature}
              </li>
            ))}
          </ul>

          {isActive ? (
            <div className="rounded-lg bg-olive/10 p-4 text-center text-sm font-medium text-olive-dark">
              Your Pro subscription is active.
            </div>
          ) : (
            <>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Loading…" : "Activate Pro"}
              </Button>
              {!user && (
                <p className="text-center text-sm text-olive-dark/60">
                  <Link href="/login" className="text-olive hover:underline">
                    Sign in
                  </Link>{" "}
                  first to continue.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
