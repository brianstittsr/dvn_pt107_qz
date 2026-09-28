"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Library, LogIn, LogOut, Shield, TrendingUp, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
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
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-navy p-5 text-slate-300">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-olive-light/60 bg-olive/20 text-tan">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">Part 107</div>
          <div className="text-xs text-slate-400">Command Center</div>
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
                  ? "bg-olive/20 text-tan-light"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
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
                ? "bg-olive/20 text-tan-light"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
            )}
          >
            <UserCog className="h-4 w-4" />
            Admin
          </Link>
        )}
      </nav>

      <div className="border-t border-slate-800 pt-4">
        {user ? (
          <div className="space-y-3">
            <div className="px-3 text-xs text-slate-400">
              <div className="font-medium text-slate-200">{user.displayName || user.email}</div>
              <div className="truncate">{user.email}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </aside>
  );
}
