import Link from "next/link";
import { AuthProvider } from "@/components/auth-provider";
import { DroneBadge } from "@/components/drone-art";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 camo-pattern" aria-hidden="true" />
        <header className="relative z-10 flex items-center justify-between bg-navy px-6 py-3 text-tan-light">
          <Link href="/" className="flex items-center gap-3">
            <DroneBadge />
            <div>
              <div className="text-sm font-bold leading-tight">Part 107</div>
              <div className="text-xs text-tan-light/60">Command Center</div>
            </div>
          </Link>
          <Link href="/" className="text-sm text-tan-light/70 hover:text-tan-light">
            ← Back to home
          </Link>
        </header>
        <main className="relative z-10">{children}</main>
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}
