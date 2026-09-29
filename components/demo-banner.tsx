"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function DemoBanner() {
  const router = useRouter();
  const { demo, exitDemo } = useAuth();

  if (!demo) return null;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-caution/40 bg-caution/10 px-6 py-1.5 text-xs text-olive-dark">
      <span>Demo mode — data is simulated. No payment or account actions are real.</span>
      <button
        type="button"
        className="shrink-0 font-medium text-olive-dark underline-offset-2 hover:underline"
        onClick={() => {
          exitDemo();
          router.push("/login");
        }}
      >
        Exit demo
      </button>
    </div>
  );
}
