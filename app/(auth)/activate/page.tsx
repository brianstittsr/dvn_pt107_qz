"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto max-w-3xl space-y-8 py-12 text-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-tan-light">Go Pro</h1>
        <p className="mt-3 text-lg text-tan-light/70">
          Support the mission and unlock powerful study tools.
        </p>
      </div>

      <Card className="mx-auto max-w-md border-olive-dark/40 bg-card text-left text-foreground">
        <CardHeader>
          <CardTitle className="text-2xl text-tan-light">Part 107 Pro</CardTitle>
          <p className="text-sm text-tan-light/60">Subscription · cancel anytime</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-4xl font-bold text-tan-light">
            $97<span className="text-lg font-normal text-tan-light/60">/mo</span>
          </div>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-tan-light/80">
                <Check className="mt-0.5 h-4 w-4 text-olive-light" />
                {feature}
              </li>
            ))}
          </ul>

          {isActive ? (
            <div className="rounded-lg bg-olive-dark/20 p-4 text-center text-sm font-medium text-olive-light">
              Your Pro subscription is active.
            </div>
          ) : (
            <>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-olive text-white hover:bg-olive-light"
              >
                {loading ? "Loading…" : "Activate Pro"}
              </Button>
              {!user && (
                <p className="text-center text-sm text-tan-light/60">
                  <Link href="/login" className="text-olive-light hover:underline">
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
