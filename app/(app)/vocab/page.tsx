"use client";

import * as React from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories, vocabTerms } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Filter = "all" | "known" | "unknown";

export default function VocabPage() {
  const { stats, markVocabKnown } = useAppStore();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [order, setOrder] = React.useState(vocabTerms);
  const [flipped, setFlipped] = React.useState<Record<string, boolean>>({});

  const filtered = order.filter((v) => {
    const known = stats.knownVocab.includes(v.id);
    if (filter === "known") return known;
    if (filter === "unknown") return !known;
    return true;
  });

  const shuffleTerms = () => setOrder([...vocabTerms].sort(() => Math.random() - 0.5));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vocabulary Deck</h1>
          <p className="text-slate-500">Flip cards and mark terms as mastered.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            {(["all", "unknown", "known"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                  filter === f ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={shuffleTerms}>
            <Shuffle className="mr-1 h-4 w-4" />
            Shuffle
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No cards here yet. Try another filter.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => {
            const known = stats.knownVocab.includes(v.id);
            return (
              <Card
                key={v.id}
                onClick={() => setFlipped((prev) => ({ ...prev, [v.id]: !prev[v.id] }))}
                className="cursor-pointer transition-shadow hover:shadow-md"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-olive">
                      {categories.find((c) => c.id === v.categoryId)?.name ?? v.categoryId}
                    </span>
                    <span className="text-xs text-slate-400">Click to flip</span>
                  </div>
                  <div
                    className={cn("min-h-[80px]", flipped[v.id] ? "text-slate-700" : "text-xl font-semibold")}
                  >
                    {flipped[v.id] ? v.definition : v.term}
                  </div>
                  <Button
                    variant={known ? "outline" : "default"}
                    size="sm"
                    className={known ? "" : "bg-olive text-white hover:bg-olive-light"}
                    onClick={(e) => {
                      e.stopPropagation();
                      markVocabKnown(v.id, !known);
                    }}
                  >
                    {known ? "Mastered ✓" : "Mark mastered"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
