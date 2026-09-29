"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

/**
 * Gates the app shell: redirects to /login (preserving the target in ?next=)
 * until a real Firebase user or a demo session is present.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, demo, loading } = useAuth();

  React.useEffect(() => {
    if (loading) return;
    if (!user && !demo) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, demo, pathname, router]);

  if (loading) {
    return (
      <div
        className="flex h-full min-h-[60vh] items-center justify-center gap-2 text-olive-dark/60"
        role="status"
        aria-label="Checking credentials"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        Checking credentials…
      </div>
    );
  }

  if (!user && !demo) return null;

  return <>{children}</>;
}
