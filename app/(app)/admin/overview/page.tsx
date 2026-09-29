"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HudCard } from "@/components/military";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api-client";
import { DEMO_OVERVIEW } from "@/lib/demo-data";

interface OverviewStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalQuizSessions: number;
  freeUsers: number;
  revenueCents: number;
  pastDueUsers: number;
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { effectiveProfile, demo, loading: authLoading } = useAuth();
  const [stats, setStats] = React.useState<OverviewStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authLoading) return;
    if (effectiveProfile?.role !== "admin") {
      router.replace("/admin");
      return;
    }
    if (demo) {
      // Defer fixture state out of the effect body (react-hooks/set-state-in-effect).
      void Promise.resolve().then(() => {
        setStats(DEMO_OVERVIEW);
        setLoading(false);
      });
      return;
    }
    apiFetch<OverviewStats>("/api/admin/overview")
      .then((data) => setStats(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [authLoading, effectiveProfile, demo, router]);

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-olive-dark/60">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading platform metrics…
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="py-6 text-danger">{error ?? "No data available"}</CardContent>
        </Card>
      </div>
    );
  }

  const metrics = [
    { label: "Total users", value: stats.totalUsers, icon: Users },
    { label: "Active subscriptions", value: stats.activeSubscriptions, icon: BarChart3 },
    { label: "Free-tier users", value: stats.freeUsers, icon: Users },
    { label: "Quiz sessions completed", value: stats.totalQuizSessions, icon: BarChart3 },
    {
      label: "Revenue",
      value: `$${(stats.revenueCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: BarChart3,
    },
    { label: "Past due", value: stats.pastDueUsers, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <h1 className="stencil text-2xl tracking-tight text-olive-dark">Platform Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <HudCard key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase text-olive-dark/60">
                  <Icon className="h-4 w-4" />
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
              </CardContent>
            </HudCard>
          );
        })}
      </div>
    </div>
  );
}
