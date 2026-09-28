"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { categories, getQuestionsByCategory, questions } from "@/lib/data";
import { useAppStore, QuizState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuiz(categoryId: "all" | string, length: number | "all"): QuizState {
  const pool = categoryId === "all" ? shuffle(questions) : shuffle(getQuestionsByCategory(categoryId));
  const count = length === "all" ? pool.length : Math.min(Number(length), pool.length);
  return {
    categoryId,
    length,
    items: pool.slice(0, count).map((q) => ({
      questionId: q.id,
      categoryId: q.categoryId,
      selectedIndex: null,
      correctIndex: q.correctIndex,
      answered: false,
    })),
    index: 0,
    startedAt: new Date().toISOString(),
  };
}

export default function QuizPage() {
  const router = useRouter();
  const { currentQuiz, setCurrentQuiz, answerQuestion } = useAppStore();
  const [categoryId, setCategoryId] = React.useState<"all" | string>("all");
  const [length, setLength] = React.useState<number | "all">(10);

  const startQuiz = React.useCallback(() => {
    const quiz = buildQuiz(categoryId, length);
    if (quiz.items.length === 0) {
      toast.error("No questions available for this category.");
      return;
    }
    setCurrentQuiz(quiz);
  }, [categoryId, length, setCurrentQuiz]);

  const handleAnswer = (index: number) => {
    answerQuestion(index);
  };

  const currentItem = currentQuiz?.items[currentQuiz.index];
  const currentQuestion = currentItem ? questions.find((q) => q.id === currentItem.questionId) : null;
  const finished = currentQuiz ? currentQuiz.index >= currentQuiz.items.length : false;
  const score = currentQuiz?.items.filter((i) => i.selectedIndex === i.correctIndex).length ?? 0;

  if (currentQuiz && finished) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mission complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold">
              {score} / {currentQuiz.items.length} correct
            </p>
            <p className="text-slate-500">
              {score === currentQuiz.items.length
                ? "Outstanding. You are cleared for the next challenge."
                : "Review the debrief and run it again."}
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setCurrentQuiz(null)} className="bg-olive text-white hover:bg-olive-light">
                Back to setup
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuiz || currentQuiz.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Lab</h1>
          <p className="text-slate-500">Choose a focus area and launch a quiz.</p>
        </div>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="category">Focus area</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-olive"
              >
                <option value="all">Mixed review — all areas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Questions</Label>
              <select
                id="length"
                value={length}
                onChange={(e) => setLength(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-olive"
              >
                <option value="10">10 questions</option>
                <option value="20">20 questions</option>
                <option value="all">All available</option>
              </select>
            </div>
            <Button onClick={startQuiz} className="w-full bg-olive text-white hover:bg-olive-light">
              Launch quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion || !currentItem) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Question {currentQuiz.index + 1}</h1>
          <p className="text-sm text-slate-500">
            {currentQuiz.index + 1} of {currentQuiz.items.length} ·{" "}
            {categories.find((c) => c.id === currentQuestion.categoryId)?.name}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setCurrentQuiz(null)}>
          Exit quiz
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <p className="text-lg font-medium leading-relaxed">{currentQuestion.question}</p>
          <div className="grid gap-3">
            {currentQuestion.answers.map((answer, idx) => {
              const selected = currentItem.selectedIndex === idx;
              const isCorrect = idx === currentItem.correctIndex;
              const showResult = currentItem.answered;
              return (
                <button
                  key={idx}
                  disabled={currentItem.answered}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                    showResult && isCorrect && "border-olive bg-olive/10",
                    showResult && selected && !isCorrect && "border-red-400 bg-red-50",
                    !showResult && "hover:border-olive hover:bg-slate-50",
                    !showResult && selected && "border-olive bg-olive/10"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{answer}</span>
                </button>
              );
            })}
          </div>

          {currentItem.answered && (
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
              <strong>Debrief:</strong> {currentQuestion.explanation}
            </div>
          )}

          {currentItem.answered && (
            <Button
              onClick={() =>
                setCurrentQuiz({
                  ...currentQuiz,
                  index: currentQuiz.index + 1,
                })
              }
              className="w-full bg-olive text-white hover:bg-olive-light"
            >
              {currentQuiz.index + 1 === currentQuiz.items.length ? "Finish quiz" : "Next question"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
