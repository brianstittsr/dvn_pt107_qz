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
        <h1 className="text-3xl font-bold tracking-tight text-tan-light">Progress Center</h1>
        <p className="text-tan-light/60">Your study data, at a glance.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-olive-dark/40 bg-card text-foreground">
          <CardHeader>
            <CardTitle className="text-tan-light">Overall readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-bold text-olive-light">{readiness}%</div>
            <div className="h-3 w-full rounded-full bg-olive-dark/30">
              <div className="h-3 rounded-full bg-olive transition-all" style={{ width: `${readiness}%` }} />
            </div>
            <p className="text-sm text-tan-light/60">
              {stats.answered === 0
                ? "Answer a few questions to build your baseline."
                : `You've answered ${stats.answered} questions with ${percent(
                    stats.correct,
                    stats.answered
                  )}% accuracy.`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-olive-dark/40 bg-card text-foreground">
          <CardHeader>
            <CardTitle className="text-tan-light">Vocabulary recall</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-bold text-olive-light">
              {Math.round((stats.knownVocab.length / categories.length) * 100)}%
            </div>
            <p className="text-sm text-tan-light/60">{stats.knownVocab.length} terms marked as mastered.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-olive-dark/40 bg-card text-foreground">
        <CardHeader>
          <CardTitle className="text-tan-light">By category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const cat = stats.byCategory[category.id] ?? { answered: 0, correct: 0 };
              const pct = cat.answered ? Math.round((cat.correct / cat.answered) * 100) : 0;
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-tan-light">{category.name}</span>
                    <span className="text-tan-light/60">
                      {cat.answered > 0 ? `${pct}% · ${cat.correct}/${cat.answered}` : "—"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-olive-dark/30">
                    <div className="h-2 rounded-full bg-olive transition-all" style={{ width: `${pct}%` }} />
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
