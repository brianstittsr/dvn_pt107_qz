"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { percent } from "@/lib/utils";

export default function ProgressPage() {
  const { stats } = useAppStore();

  const readiness = Math.round(
    categories.reduce((sum, c) => {
      const cat = stats.byCategory[c.id] ?? { answered: 0, correct: 0 };
      return sum + percent(cat.correct, cat.answered);
    }, 0) / categories.length
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Center</h1>
        <p className="text-slate-500">Your study data, at a glance.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-bold text-emerald-600">{readiness}%</div>
            <div className="h-3 w-full rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${readiness}%` }}
              />
            </div>
            <p className="text-sm text-slate-500">
              {stats.answered === 0
                ? "Answer a few questions to build your baseline."
                : `You've answered ${stats.answered} questions with ${percent(
                    stats.correct,
                    stats.answered
                  )}% accuracy.`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vocabulary recall</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-bold text-emerald-600">
              {Math.round((stats.knownVocab.length / categories.length) * 100)}%
            </div>
            <p className="text-sm text-slate-500">
              {stats.knownVocab.length} terms marked as mastered.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const cat = stats.byCategory[category.id] ?? { answered: 0, correct: 0 };
              const pct = cat.answered ? Math.round((cat.correct / cat.answered) * 100) : 0;
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-slate-500">
                      {cat.answered > 0 ? `${pct}% · ${cat.correct}/${cat.answered}` : "—"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
