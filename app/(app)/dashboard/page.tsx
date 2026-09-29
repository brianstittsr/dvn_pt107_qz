"use client";

import Link from "next/link";
import { BookOpen, Brain, Flame, Library, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { categories } from "@/lib/data";
import { percent } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";

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
        <h1 className="text-3xl font-bold tracking-tight text-tan-light">Good to see you, pilot.</h1>
        <p className="text-tan-light/60">FAA Remote Pilot prep · Small UAS · UAG</p>
      </div>

      {profile?.subscriptionStatus === "active" && (
        <div className="rounded-lg bg-olive-dark/20 px-4 py-2 text-sm text-olive-light">
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
          <Card key={metric.label} className="border-olive-dark/40 bg-card text-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase text-tan-light/60">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-olive-dark/40 bg-card text-foreground lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tan-light">
              <Brain className="h-5 w-5 text-olive-light" />
              Weakest area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-tan-light">{weakest}</div>
            <p className="text-sm text-tan-light/60">Focus here to raise your overall readiness score.</p>
          </CardContent>
        </Card>

        <Card className="border-olive-dark/40 bg-card text-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tan-light">
              <TrendingUp className="h-5 w-5 text-olive-light" />
              Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-olive-light">{readiness}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-olive-dark/30">
              <div className="h-2 rounded-full bg-olive transition-all" style={{ width: `${readiness}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/quiz">
          <Card className="h-full border-olive-dark/40 bg-card text-foreground transition-shadow hover:shadow-lg hover:shadow-olive-dark/20">
            <CardHeader>
              <BookOpen className="h-6 w-6 text-olive-light" />
              <CardTitle className="text-tan-light">Quiz Lab</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-tan-light/60">Mixed review or focus on one knowledge area.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/vocab">
          <Card className="h-full border-olive-dark/40 bg-card text-foreground transition-shadow hover:shadow-lg hover:shadow-olive-dark/20">
            <CardHeader>
              <Library className="h-6 w-6 text-olive-light" />
              <CardTitle className="text-tan-light">Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-tan-light/60">Flip cards and master the language of flight.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/activate">
          <Card className="h-full border-olive-dark/40 bg-card text-foreground transition-shadow hover:shadow-lg hover:shadow-olive-dark/20">
            <CardHeader>
              <Flame className="h-6 w-6 text-olive-light" />
              <CardTitle className="text-tan-light">Activate Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-tan-light/60">
                {profile?.subscriptionStatus === "active"
                  ? "Your Pro subscription is active."
                  : "Sync progress and unlock full history with Pro."}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {!user && (
        <div className="rounded-lg border border-olive-dark/40 bg-card p-4 text-sm text-tan-light/80">
          You are using the app as a guest.{" "}
          <Link href="/login" className="font-medium text-olive-light hover:underline">
            Sign in
          </Link>{" "}
          to sync your progress.
        </div>
      )}
    </div>
  );
}
