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
          <h1 className="text-3xl font-bold tracking-tight text-tan-light">Vocabulary Deck</h1>
          <p className="text-tan-light/60">Flip cards and mark terms as mastered.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-olive-dark/40 bg-card p-1">
            {(["all", "unknown", "known"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                  filter === f ? "bg-olive text-white" : "text-tan-light/70 hover:bg-olive-dark/20 hover:text-tan-light"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={shuffleTerms} className="border-olive-dark/40 text-tan-light hover:bg-card-2">
            <Shuffle className="mr-1 h-4 w-4" />
            Shuffle
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-olive-dark/40 bg-card text-foreground">
          <CardContent className="py-12 text-center text-tan-light/60">
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
                className="cursor-pointer border-olive-dark/40 bg-card text-foreground transition-shadow hover:shadow-lg hover:shadow-olive-dark/20"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-olive-light">
                      {categories.find((c) => c.id === v.categoryId)?.name ?? v.categoryId}
                    </span>
                    <span className="text-xs text-tan-light/40">Click to flip</span>
                  </div>
                  <div
                    className={cn(
                      "min-h-[80px] text-tan-light",
                      flipped[v.id] ? "text-tan-light/80" : "text-xl font-semibold text-tan-light"
                    )}
                  >
                    {flipped[v.id] ? v.definition : v.term}
                  </div>
                  <Button
                    variant={known ? "outline" : "default"}
                    size="sm"
                    className={known ? "border-olive-dark/40 bg-card-2 text-tan-light hover:bg-olive-dark/20" : "bg-olive text-white hover:bg-olive-light"}
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
