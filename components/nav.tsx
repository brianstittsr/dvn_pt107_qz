"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Library, LogIn, LogOut, TrendingUp, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InsigniaBadge } from "@/components/military";
import { useAuth } from "@/components/auth-provider";
import { DroneBadge } from "@/components/drone-art";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quiz", label: "Quiz Lab", icon: BookOpen },
  { href: "/vocab", label: "Vocabulary", icon: Library },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

export function Nav() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-navy bg-navy p-5 text-tan-light/80">
      <div className="pointer-events-none absolute inset-0 camo-pattern" aria-hidden="true" />
      <div className="relative flex h-full flex-col">
        <Link href="/" className="mb-8 flex items-center gap-3 px-2 text-tan-light">
          <DroneBadge />
          <div>
            <div className="text-sm font-bold leading-tight">Part 107</div>
            <div className="text-xs text-tan-light/50">Command Center</div>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "border-l-2 border-olive-light bg-white/10 text-white"
                    : "hover:bg-white/5 hover:text-tan-light"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                pathname.startsWith("/admin")
                  ? "border-l-2 border-olive-light bg-white/10 text-white"
                  : "hover:bg-white/5 hover:text-tan-light"
              )}
            >
              <UserCog className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="border-t border-tan-light/20 pt-4">
          {user ? (
            <div className="space-y-3">
              <div className="space-y-1 px-3 text-xs text-tan-light/50">
                <div className="font-medium text-tan-light">{user.displayName || user.email}</div>
                <div className="truncate">{user.email}</div>
                <div className="pt-1">
                  <InsigniaBadge
                    variant={profile?.subscriptionStatus === "active" ? "pro" : "free"}
                  >
                    {profile?.subscriptionStatus === "active" ? "Pro" : "Free tier"}
                  </InsigniaBadge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-tan-light/70 hover:bg-white/10 hover:text-tan-light"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="dark" size="sm" className="w-full justify-start">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
