export interface Category {
  id: string;
  name: string;
  desc: string;
}

export interface Question {
  id: string;
  categoryId: string;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
}

export interface VocabTerm {
  id: string;
  term: string;
  definition: string;
  categoryId: string;
}

export interface QuizSession {
  id: string;
  userId: string;
  startedAt: string;
  completedAt: string;
  categoryId: "all" | string;
  questionCount: number;
  score: number;
  items: QuizSessionItem[];
}

export interface QuizSessionItem {
  questionId: string;
  categoryId: string;
  selectedIndex: number;
  correctIndex: number;
  correct: boolean;
  answeredAt: string;
}

export interface UserStats {
  answered: number;
  correct: number;
  streak: number;
  lastActivityDate: string | null;
  knownVocab: string[];
  byCategory: Record<string, { answered: number; correct: number }>;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  subscriptionStatus: "inactive" | "active" | "canceled" | "past_due";
  subscriptionExpiry: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}
