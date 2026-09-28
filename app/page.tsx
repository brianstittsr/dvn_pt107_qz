import Link from "next/link";
import { Plane, BookOpen, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 py-12">
      <section className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
          <Plane className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Pass the FAA Part 107 exam.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          A modern study companion for aspiring Remote Pilots. Practice with realistic quiz questions,
          master aviation vocabulary, and track your readiness from your first question to test day.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/quiz">
            <Button size="lg" className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
              Start free quiz
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              Go to dashboard
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="space-y-1">
            <BookOpen className="h-6 w-6 text-emerald-500" />
            <CardTitle>Realistic questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Exam-style questions across all FAA knowledge areas with instant explanations.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <Trophy className="h-6 w-6 text-emerald-500" />
            <CardTitle>Progress tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              See your accuracy, streak, and weakest areas so you know exactly what to study next.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <Zap className="h-6 w-6 text-emerald-500" />
            <CardTitle>Vocabulary deck</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Flip cards and mark terms as mastered. Learn the language of aviation at your pace.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-1">
            <Plane className="h-6 w-6 text-emerald-500" />
            <CardTitle>Study anywhere</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Mobile-friendly layout. Sign in to sync your progress across devices.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-2xl bg-slate-900 px-8 py-12 text-center text-white">
        <h2 className="text-2xl font-semibold">Ready to earn your Remote Pilot certificate?</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          The core quiz is free. Upgrade to Pro to unlock cloud sync, full quiz history, and advanced
          analytics that keep you on track.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/activate">
            <Button size="lg" className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
              Activate Pro
            </Button>
          </Link>
          <Link href="/quiz">
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              Try it free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
