"use client";

import { useSyncQuizSessions } from "@/hooks/use-sync";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  useSyncQuizSessions();
  return <>{children}</>;
}
