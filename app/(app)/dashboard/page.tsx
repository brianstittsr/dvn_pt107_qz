"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, Brain, Flame, Library, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRank, HudCard, InsigniaBadge } from "@/components/military";
import { useAppStore } from "@/lib/store";
import { categories } from "@/lib/data";
import { percent } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api-client";
import { getPlan } from "@/lib/plans";
import { toast } from "sonner";

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString() : "—";
}

function SubscriptionCard() {
  const { user, profile, refreshProfile } = useAuth();
  const searchParams = useSearchParams();
  const [confirming, setConfirming] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Payment received — welcome to Pro!");
      refreshProfile();
    }
  }, [searchParams, refreshProfile]);

  if (!user || !profile) return null;

  const plan = profile.planId ? getPlan(profile.planId) : null;
  const isActive = profile.subscriptionStatus === "active";
  const isMonthly = profile.planId === "monthly";
  const expiry = formatDate(profile.subscriptionExpiry);

  const call = async (path: string, successMsg: string) => {
    setBusy(true);
    try {
      await apiFetch(path, { method: "POST" });
      toast.success(successMsg);
      await refreshProfile();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  const openPortal = async () => {
    setBusy(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/api/stripe/portal", { method: "POST" });
      window.location.href = url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not open billing portal");
      setBusy(false);
    }
  };

  return (
    <Card className="relative overflow-hidden pt-1">
      <div className="hazard-stripe absolute inset-x-0 top-0" aria-hidden="true" />
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-olive-dark">
          <span>Your subscription</span>
          <InsigniaBadge variant={isActive ? "pro" : "free"}>
            {isActive ? "Pro" : "Free tier"}
          </InsigniaBadge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <span className="font-medium text-foreground">{plan ? plan.name : "Free tier"}</span>
          <span className="text-olive-dark/60 capitalize">
            Status: {profile.subscriptionStatus.replace("_", " ")}
          </span>
          {isActive && plan && (
            <span className="text-olive-dark/60">
              {isMonthly && !profile.cancelAtPeriodEnd ? `Renews on ${expiry}` : `Access until ${expiry}`}
            </span>
          )}
        </div>

        {isActive && plan && plan.mode === "payment" && (
          <p className="text-sm text-olive-dark/60">Prepaid — no renewal. Access until {expiry}.</p>
        )}

        {confirming ? (
          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-danger/5 p-3 text-sm text-danger">
            <span>Cancel at end of period? You keep access until {expiry}.</span>
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                disabled={busy}
                onClick={() => call("/api/stripe/cancel", "Subscription will cancel at period end.")}
              >
                Confirm
              </Button>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => setConfirming(false)}>
                Keep
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {isActive && isMonthly && !profile.cancelAtPeriodEnd && (
              <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
                Cancel subscription
              </Button>
            )}
            {isActive && isMonthly && profile.cancelAtPeriodEnd && (
              <Button
                size="sm"
                disabled={busy}
                onClick={() => call("/api/stripe/resume", "Subscription resumed.")}
              >
                Resume subscription
              </Button>
            )}
            {!isActive && (
              <Link href="/activate">
                <Button size="sm">Go Pro</Button>
              </Link>
            )}
            {(isActive || profile.stripeCustomerId) && (
              <Button variant="outline" size="sm" disabled={busy} onClick={openPortal}>
                Manage billing
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { stats } = useAppStore();
  const { user, profile } = useAuth();

  const readiness = Math.round(
    categories.reduce((sum, c) => {
      const cat = stats.byCategory[c.id] ?? { answered: 0, correct: 0 };
      return sum + percent(cat.correct, cat.answered);
    }, 0) / categories.length
  );

  const answered = stats.answered;
  const accuracy = percent(stats.correct, stats.answered);

  const ranked = categories
    .map((c) => ({
      category: c,
      stat: stats.byCategory[c.id] ?? { answered: 0, correct: 0 },
      percent: percent(stats.byCategory[c.id]?.correct ?? 0, stats.byCategory[c.id]?.answered ?? 0),
    }))
    .filter((x) => x.stat.answered > 0)
    .sort((a, b) => a.percent - b.percent);

  const weakest = ranked[0]?.category.name ?? "Not enough data";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="stencil text-3xl tracking-tight text-olive-dark">Good to see you, pilot.</h1>
        <p className="text-olive-dark/60">FAA Remote Pilot prep · Small UAS · UAG</p>
      </div>

      {profile?.subscriptionStatus === "active" && (
        <div className="rounded-lg bg-olive/10 px-4 py-2 text-sm text-olive-dark">
          Pro is active. Your progress syncs across devices.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Questions answered", value: answered },
          { label: "Accuracy", value: answered ? `${accuracy}%` : "—" },
          { label: "Terms mastered", value: stats.knownVocab.length },
          { label: "Study streak", value: stats.streak },
        ].map((metric) => (
          <HudCard key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase text-olive-dark/60">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metric.value}</div>
            </CardContent>
          </HudCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-olive-dark">
              <Brain className="h-5 w-5 text-olive" />
              Weakest area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{weakest}</div>
            <p className="text-sm text-olive-dark/60">Focus here to raise your overall readiness score.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-olive-dark">
              <TrendingUp className="h-5 w-5 text-olive" />
              Readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold text-olive">{readiness}%</div>
            <div className="h-2 w-full rounded-full bg-surface-2">
              <div className="h-2 rounded-full bg-olive transition-all" style={{ width: `${readiness}%` }} />
            </div>
            <ChevronRank readiness={readiness} />
          </CardContent>
        </Card>
      </div>

      <React.Suspense fallback={null}>
        <SubscriptionCard />
      </React.Suspense>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/quiz">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader>
              <BookOpen className="h-6 w-6 text-olive" />
              <CardTitle className="text-olive-dark">Quiz Lab</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-olive-dark/60">Mixed review or focus on one knowledge area.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/vocab">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader>
              <Library className="h-6 w-6 text-olive" />
              <CardTitle className="text-olive-dark">Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-olive-dark/60">Flip cards and master the language of flight.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/activate">
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader>
              <Flame className="h-6 w-6 text-olive" />
              <CardTitle className="text-olive-dark">Activate Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-olive-dark/60">
                {profile?.subscriptionStatus === "active"
                  ? "Your Pro subscription is active."
                  : "Sync progress and unlock full history with Pro."}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {!user && (
        <div className="rounded-lg border border-tan/40 bg-surface p-4 text-sm text-olive-dark/80">
          You are using the app as a guest.{" "}
          <Link href="/login" className="font-medium text-olive hover:underline">
            Sign in
          </Link>{" "}
          to sync your progress.
        </div>
      )}
    </div>
  );
}
