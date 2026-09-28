import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserStats } from "@/lib/types";

export interface QuizState {
  categoryId: "all" | string;
  length: number | "all";
  items: {
    questionId: string;
    categoryId: string;
    selectedIndex: number | null;
    correctIndex: number;
    answered: boolean;
  }[];
  index: number;
  startedAt: string | null;
}

interface AppState {
  stats: UserStats;
  currentQuiz: QuizState | null;
  setCurrentQuiz: (quiz: QuizState | null) => void;
  answerQuestion: (selectedIndex: number) => void;
  markVocabKnown: (termId: string, known: boolean) => void;
  resetStats: () => void;
  replaceStats: (stats: UserStats) => void;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function updateStreak(stats: UserStats): number {
  const today = getToday();
  if (stats.lastActivityDate === today) return stats.streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  if (stats.lastActivityDate === yesterdayStr) return stats.streak + 1;
  return 1;
}

const defaultStats: UserStats = {
  answered: 0,
  correct: 0,
  streak: 0,
  lastActivityDate: null,
  knownVocab: [],
  byCategory: {},
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      stats: defaultStats,
      currentQuiz: null,
      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
      answerQuestion: (selectedIndex: number) => {
        const { currentQuiz, stats } = get();
        if (!currentQuiz) return;
        const item = currentQuiz.items[currentQuiz.index];
        if (!item || item.answered) return;
        const correct = selectedIndex === item.correctIndex;
        const newItems = [...currentQuiz.items];
        newItems[currentQuiz.index] = { ...item, selectedIndex, answered: true };
        const nextIndex = currentQuiz.index + 1;
        const newQuiz: QuizState = {
          ...currentQuiz,
          items: newItems,
          index: nextIndex,
        };
        const categoryStats = stats.byCategory[item.categoryId] ?? { answered: 0, correct: 0 };
        const newByCategory = {
          ...stats.byCategory,
          [item.categoryId]: {
            answered: categoryStats.answered + 1,
            correct: categoryStats.correct + (correct ? 1 : 0),
          },
        };
        const newStats: UserStats = {
          ...stats,
          answered: stats.answered + 1,
          correct: stats.correct + (correct ? 1 : 0),
          streak: updateStreak(stats),
          lastActivityDate: getToday(),
          byCategory: newByCategory,
        };
        set({ currentQuiz: newQuiz, stats: newStats });
      },
      markVocabKnown: (termId, known) => {
        const { stats } = get();
        const knownVocab = new Set(stats.knownVocab);
        if (known) knownVocab.add(termId);
        else knownVocab.delete(termId);
        set({
          stats: { ...stats, knownVocab: Array.from(knownVocab) },
        });
      },
      resetStats: () => set({ stats: defaultStats }),
      replaceStats: (stats) => set({ stats }),
    }),
    {
      name: "part107-study-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
