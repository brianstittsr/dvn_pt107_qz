"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InsigniaBadge } from "@/components/military";
import { useAuth } from "@/components/auth-provider";
import { DroneBadge } from "@/components/drone-art";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Quiz Lab" },
  { href: "/vocab", label: "Vocabulary" },
  { href: "/progress", label: "Progress" },
  { href: "/activate", label: "Pricing" },
];

export function SiteHeader({ variant = "full" }: { variant?: "full" | "compact" }) {
  const pathname = usePathname();
  const { user, profile, loading } = useAuth();

  return (
    <header className="relative overflow-hidden border-b border-tan-light/20 bg-navy text-tan-light">
      <div className="pointer-events-none absolute inset-0 camo-pattern" aria-hidden="true" />
      <div className="hazard-stripe absolute inset-x-0 bottom-0 h-0.5" aria-hidden="true" />
      <div className="relative flex items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <DroneBadge />
          <div>
            <div className="text-sm font-bold leading-tight">Part 107</div>
            <div className="text-xs text-tan-light/60">Command Center</div>
          </div>
        </Link>

        {variant === "full" && (
          <nav className="hidden items-center gap-6 md:flex" aria-label="Site navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm text-tan-light/70 hover:text-white",
                    active && "border-b-2 border-olive-light text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className={cn("flex items-center gap-3", loading && "invisible")}>
          {user ? (
            <>
              <InsigniaBadge variant={profile?.subscriptionStatus === "active" ? "pro" : "free"}>
                {profile?.subscriptionStatus === "active" ? "Pro" : "Free tier"}
              </InsigniaBadge>
              <span className="hidden max-w-40 truncate text-sm text-tan-light/80 sm:inline">
                {user.displayName || user.email}
              </span>
              <Link href="/dashboard">
                <Button variant="dark" size="sm">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="dark" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/activate">
                <Button size="sm">Go Pro</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
