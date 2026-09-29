"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Crosshair,
  Flame,
  RefreshCcw,
  Shield,
  Target,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useAppStore } from "@/lib/store";
import { categories } from "@/lib/data";
import { percent } from "@/lib/utils";

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, signInWithGoogle, loading } = useAuth();
  const { stats, resetStats } = useAppStore();

  const totalAnswered = stats.answered;
  const totalCorrect = stats.correct;
  const accuracy = percent(totalCorrect, totalAnswered);

  const readiness = Math.round(
    categories.reduce((sum, c) => {
      const cat = stats.byCategory[c.id] ?? { answered: 0, correct: 0 };
      return sum + percent(cat.correct, cat.answered);
    }, 0) / categories.length
  );

  const categoryStats = categories.map((category) => {
    const cat = stats.byCategory[category.id] ?? { answered: 0, correct: 0 };
    return { category, ...cat, pct: percent(cat.correct, cat.answered) };
  });

  const ranked = categoryStats.filter((c) => c.answered > 0).sort((a, b) => a.pct - b.pct);
  const focusAreas = ranked.slice(0, 3);
  const strongAreas = [...ranked].sort((a, b) => b.pct - a.pct).slice(0, 3);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-tan-light/60">Loading mission data…</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-tan-light">Command Center</h1>
          <p className="text-tan-light/60">Track readiness, identify gaps, and manage your study mission.</p>
        </div>
        {user ? (
          <div className="flex items-center gap-3 rounded-lg border border-olive-dark/40 bg-card px-4 py-2 text-sm text-tan-light">
            <User className="h-4 w-4 text-tan-light/60" />
            <span className="text-tan-light">{user.displayName || user.email}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                profile?.subscriptionStatus === "active"
                  ? "bg-olive-dark/30 text-olive-light"
                  : "bg-card-2 text-tan-light/60"
              }`}
            >
              {profile?.subscriptionStatus === "active" ? "Pro active" : "Free tier"}
            </span>
            {profile?.role === "admin" && (
              <span className="rounded-full bg-olive-dark/20 px-2 py-0.5 text-xs font-medium text-olive-light">
                Admin
              </span>
            )}
          </div>
        ) : (
          <Button onClick={signInWithGoogle} className="bg-olive text-white hover:bg-olive-light">
            Sign in with Google
          </Button>
        )}
      </div>

      {profile?.role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-olive-dark/40 bg-card text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-tan-light">
                <Users className="h-5 w-5 text-olive-light" />
                User management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-tan-light/70">View registered users, roles, and subscription status.</p>
              <Button
                className="mt-4 bg-olive text-white hover:bg-olive-light"
                size="sm"
                onClick={() => router.push("/admin/users")}
              >
                Open user admin
              </Button>
            </CardContent>
          </Card>
          <Card className="border-olive-dark/40 bg-card text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-tan-light">
                <BarChart3 className="h-5 w-5 text-olive-light" />
                Site overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-tan-light/70">Platform-wide activity, subscription, and quiz metrics.</p>
              <Button
                className="mt-4 bg-olive text-white hover:bg-olive-light"
                size="sm"
                onClick={() => router.push("/admin/overview")}
              >
                Open overview
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Questions answered", icon: BookOpen, value: totalAnswered },
          { label: "Accuracy", icon: Target, value: totalAnswered ? `${accuracy}%` : "—" },
          { label: "Study streak", icon: Flame, value: `${stats.streak} days` },
          { label: "Readiness", icon: Trophy, value: `${readiness}%`, valueClass: "text-olive-light" },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-olive-dark/40 bg-card text-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase text-tan-light/60">
                  <Icon className="h-4 w-4" />
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${metric.valueClass ?? "text-tan-light"}`}>{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Focus areas */}
        <Card className="border-red-900/30 bg-red-950/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Priority focus areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {focusAreas.length === 0 ? (
              <p className="text-sm text-tan-light/60">
                Answer questions in each category to generate focus recommendations.
              </p>
            ) : (
              <div className="space-y-4">
                {focusAreas.map((item) => (
                  <div key={item.category.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-tan-light">{item.category.name}</span>
                      <span className="text-tan-light/60">
                        {item.pct}% · {item.correct}/{item.answered}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-olive-dark/30">
                      <div
                        className="h-2 rounded-full bg-red-500 transition-all"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-tan-light/50">{item.category.desc}</p>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/quiz">
                    <Button size="sm" className="bg-red-600 text-white hover:bg-red-500">
                      <Crosshair className="mr-1.5 h-4 w-4" />
                      Target weak area
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strong areas */}
        <Card className="border-olive-dark/40 bg-card text-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-olive-light">
              <Shield className="h-5 w-5" />
              Mission-ready areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strongAreas.length === 0 ? (
              <p className="text-sm text-tan-light/60">No data yet. Start a quiz to build your profile.</p>
            ) : (
              <ul className="space-y-3">
                {strongAreas.map((item) => (
                  <li key={item.category.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-tan-light">{item.category.name}</span>
                    <span className="font-semibold text-olive-light">{item.pct}%</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All categories */}
      <Card className="border-olive-dark/40 bg-card text-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tan-light">
            <BarChart3 className="h-5 w-5 text-olive-light" />
            Full category breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryStats.map((item) => (
              <div key={item.category.id} className="rounded-lg border border-olive-dark/40 bg-card-2 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-tan-light">{item.category.name}</span>
                  <span className="text-tan-light/60">{item.answered ? `${item.pct}%` : "—"}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-olive-dark/30">
                  <div className="h-2 rounded-full bg-olive transition-all" style={{ width: `${item.pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-tan-light/50">{item.category.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-lg border border-olive-dark/40 bg-card p-4">
        <div className="text-sm text-tan-light/80">
          <strong className="text-tan-light">Reset mission data</strong>
          <p className="text-tan-light/60">Clears local progress. Signed-in Pro users keep cloud history.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetStats} className="border-olive-dark/40 text-tan-light hover:bg-card-2">
          <RefreshCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
