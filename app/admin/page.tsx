"use client";

import Link from "next/link";
import { AlertTriangle, BarChart3, BookOpen, Crosshair, Flame, RefreshCcw, Shield, Target, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useAppStore } from "@/lib/store";
import { categories } from "@/lib/data";
import { percent } from "@/lib/utils";

export default function AdminPage() {
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
      <div className="flex h-full items-center justify-center text-slate-500">Loading mission data…</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operator Admin Panel</h1>
          <p className="text-slate-500">Track readiness, identify gaps, and manage your study mission.</p>
        </div>
        {user ? (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{user.displayName || user.email}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                profile?.subscriptionStatus === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {profile?.subscriptionStatus === "active" ? "Pro active" : "Free tier"}
            </span>
          </div>
        ) : (
          <Button onClick={signInWithGoogle} className="bg-emerald-600 text-white hover:bg-emerald-500">
            Sign in with Google
          </Button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
              <BookOpen className="h-4 w-4" />
              Questions answered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAnswered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
              <Target className="h-4 w-4" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAnswered ? `${accuracy}%` : "—"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
              <Flame className="h-4 w-4" />
              Study streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.streak} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
              <Trophy className="h-4 w-4" />
              Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{readiness}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Focus areas */}
        <Card className="border-red-100 bg-red-50/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Priority focus areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {focusAreas.length === 0 ? (
              <p className="text-sm text-slate-500">Answer questions in each category to generate focus recommendations.</p>
            ) : (
              <div className="space-y-4">
                {focusAreas.map((item) => (
                  <div key={item.category.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-800">{item.category.name}</span>
                      <span className="text-slate-500">
                        {item.pct}% · {item.correct}/{item.answered}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-red-500 transition-all"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{item.category.desc}</p>
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
        <Card className="border-emerald-100 bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Shield className="h-5 w-5" />
              Mission-ready areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strongAreas.length === 0 ? (
              <p className="text-sm text-slate-500">No data yet. Start a quiz to build your profile.</p>
            ) : (
              <ul className="space-y-3">
                {strongAreas.map((item) => (
                  <li key={item.category.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">{item.category.name}</span>
                    <span className="font-semibold text-emerald-600">{item.pct}%</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Full category breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryStats.map((item) => (
              <div key={item.category.id} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.category.name}</span>
                  <span className="text-slate-500">{item.answered ? `${item.pct}%` : "—"}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">{item.category.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
        <div className="text-sm text-slate-600">
          <strong>Reset mission data</strong>
          <p className="text-slate-400">Clears local progress. Signed-in Pro users keep cloud history.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetStats}>
          <RefreshCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
