"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";

interface OverviewStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalQuizSessions: number;
  freeUsers: number;
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [stats, setStats] = React.useState<OverviewStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authLoading) return;
    if (profile?.role !== "admin") {
      router.replace("/admin");
      return;
    }
    fetch("/api/admin/overview")
      .then(async (res) => {
        const json = (await res.json()) as { data?: OverviewStats; error?: string };
        if (!res.ok) throw new Error(json.error ?? "Failed to load overview");
        setStats(json.data ?? null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [authLoading, profile, router]);

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-slate-500">
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
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-6 text-red-700">{error ?? "No data available"}</CardContent>
        </Card>
      </div>
    );
  }

  const metrics = [
    { label: "Total users", value: stats.totalUsers, icon: Users },
    { label: "Active subscriptions", value: stats.activeSubscriptions, icon: BarChart3 },
    { label: "Free-tier users", value: stats.freeUsers, icon: Users },
    { label: "Quiz sessions completed", value: stats.totalQuizSessions, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Platform Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
                  <Icon className="h-4 w-4" />
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
