"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useAppStore } from "@/lib/store";
import { QuizSession } from "@/lib/types";

export function useSyncQuizSessions() {
  const { user, profile } = useAuth();
  const { currentQuiz } = useAppStore();

  useEffect(() => {
    if (!user || !profile || profile.subscriptionStatus !== "active") return;
    if (!currentQuiz || currentQuiz.index < currentQuiz.items.length) return;
    if (currentQuiz.items.length === 0) return;

    const completedAt = new Date().toISOString();
    const session: QuizSession = {
      id: `${user.uid}-${Date.now()}`,
      userId: user.uid,
      startedAt: currentQuiz.startedAt ?? completedAt,
      completedAt,
      categoryId: currentQuiz.categoryId,
      questionCount: currentQuiz.items.length,
      score: currentQuiz.items.filter((i) => i.selectedIndex === i.correctIndex).length,
      items: currentQuiz.items.map((i) => ({
        questionId: i.questionId,
        categoryId: i.categoryId,
        selectedIndex: i.selectedIndex ?? -1,
        correctIndex: i.correctIndex,
        correct: i.selectedIndex === i.correctIndex,
        answeredAt: completedAt,
      })),
    };

    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid, session }),
    }).catch((err) => {
      console.error("Failed to sync quiz session:", err);
    });
  }, [user, profile, currentQuiz]);
}
