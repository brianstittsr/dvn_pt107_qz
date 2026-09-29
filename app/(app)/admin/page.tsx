"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CreditCard,
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
import { HudCard, InsigniaBadge } from "@/components/military";
import { useAuth } from "@/components/auth-provider";
import { useAppStore } from "@/lib/store";
import { categories } from "@/lib/data";
import { percent } from "@/lib/utils";

export default function AdminPage() {
  const router = useRouter();
  const { user, effectiveProfile, demo, signInWithGoogle, loading } = useAuth();
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
      <div className="flex h-full items-center justify-center text-olive-dark/60">Loading mission data…</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="stencil text-3xl tracking-tight text-olive-dark">Command Center</h1>
          <p className="text-olive-dark/60">Track readiness, identify gaps, and manage your study mission.</p>
        </div>
        {user || demo ? (
          <div className="flex items-center gap-3 rounded-lg border border-tan/40 bg-surface px-4 py-2 text-sm text-foreground">
            <User className="h-4 w-4 text-olive-dark/60" />
            <span>{effectiveProfile?.displayName || effectiveProfile?.email}</span>
            <InsigniaBadge variant={effectiveProfile?.subscriptionStatus === "active" ? "pro" : "free"}>
              {effectiveProfile?.subscriptionStatus === "active" ? "Pro" : "Free tier"}
            </InsigniaBadge>
            {effectiveProfile?.role === "admin" && <InsigniaBadge variant="admin">Admin</InsigniaBadge>}
          </div>
        ) : (
          <Button onClick={signInWithGoogle}>Sign in with Google</Button>
        )}
      </div>

      {effectiveProfile?.role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Users,
              title: "User management",
              desc: "View registered users, roles, and subscription status.",
              href: "/admin/users",
              cta: "Open user admin",
            },
            {
              icon: BarChart3,
              title: "Site overview",
              desc: "Platform-wide activity, subscription, and quiz metrics.",
              href: "/admin/overview",
              cta: "Open overview",
            },
            {
              icon: CreditCard,
              title: "Payments",
              desc: "One-time and subscription payment records.",
              href: "/admin/payments",
              cta: "Open payments",
            },
            {
              icon: BadgeCheck,
              title: "Subscriptions",
              desc: "Manage plan access, renewals, and revocations.",
              href: "/admin/subscriptions",
              cta: "Open subscriptions",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.href} className="relative overflow-hidden pt-1">
                <div className="hazard-stripe absolute inset-x-0 top-0" aria-hidden="true" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-olive-dark">
                    <Icon className="h-5 w-5 text-olive" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-olive-dark/70">{item.desc}</p>
                  <Button className="mt-4" size="sm" onClick={() => router.push(item.href)}>
                    {item.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Questions answered", icon: BookOpen, value: totalAnswered },
          { label: "Accuracy", icon: Target, value: totalAnswered ? `${accuracy}%` : "—" },
          { label: "Study streak", icon: Flame, value: `${stats.streak} days` },
          { label: "Readiness", icon: Trophy, value: `${readiness}%`, valueClass: "text-olive" },
        ].map((metric) => {
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
                <div className={`text-3xl font-bold ${metric.valueClass ?? "text-foreground"}`}>{metric.value}</div>
              </CardContent>
            </HudCard>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Focus areas */}
        <Card className="border-danger/30 bg-danger/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              Priority focus areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {focusAreas.length === 0 ? (
              <p className="text-sm text-olive-dark/60">
                Answer questions in each category to generate focus recommendations.
              </p>
            ) : (
              <div className="space-y-4">
                {focusAreas.map((item) => (
                  <div key={item.category.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.category.name}</span>
                      <span className="text-olive-dark/60">
                        {item.pct}% · {item.correct}/{item.answered}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-2">
                      <div
                        className="h-2 rounded-full bg-danger transition-all"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-olive-dark/50">{item.category.desc}</p>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/quiz">
                    <Button size="sm" variant="danger">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-olive">
              <Shield className="h-5 w-5" />
              Mission-ready areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strongAreas.length === 0 ? (
              <p className="text-sm text-olive-dark/60">No data yet. Start a quiz to build your profile.</p>
            ) : (
              <ul className="space-y-3">
                {strongAreas.map((item) => (
                  <li key={item.category.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.category.name}</span>
                    <span className="font-semibold text-olive">{item.pct}%</span>
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
          <CardTitle className="flex items-center gap-2 text-olive-dark">
            <BarChart3 className="h-5 w-5 text-olive" />
            Full category breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryStats.map((item) => (
              <div key={item.category.id} className="rounded-lg border border-tan/40 bg-surface-2 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.category.name}</span>
                  <span className="text-olive-dark/60">{item.answered ? `${item.pct}%` : "—"}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white">
                  <div className="h-2 rounded-full bg-olive transition-all" style={{ width: `${item.pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-olive-dark/50">{item.category.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-lg border border-tan/40 bg-surface p-4">
        <div className="text-sm text-olive-dark/80">
          <strong className="text-olive-dark">Reset mission data</strong>
          <p className="text-olive-dark/60">Clears local progress. Signed-in Pro users keep cloud history.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetStats}>
          <RefreshCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
