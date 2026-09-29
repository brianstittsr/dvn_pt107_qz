"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { DEMO_ENABLED } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Read the ?next= redirect target on demand instead of useSearchParams so the
// page stays prerenderable (useSearchParams forces the subtree into the
// Suspense fallback, which would hide the demo buttons from the served HTML).
function nextTarget(): string {
  const param = new URLSearchParams(window.location.search).get("next");
  return param && param.startsWith("/") && !param.startsWith("//") ? param : "/dashboard";
}

function LoginPageInner() {
  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, enterDemo, loading } = useAuth();
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) router.push(nextTarget());
  }, [user, router]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      router.push(nextTarget());
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push(nextTarget());
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  // Render during SSR so the demo bypass is visible in the served HTML even
  // before Firebase auth state resolves. Hidden while auth resolves and once a
  // user is known (the effect above then redirects away) — prevents a flash of
  // the form for signed-in visitors, like the previous `if (loading) return null`.
  const hidden = loading || user !== null;

  return (
    <div
      aria-busy={loading}
      className={cn(
        "flex min-h-[80vh] items-center justify-center px-6 py-12",
        hidden && "invisible"
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-olive/10 text-olive">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="stencil text-center text-lg text-olive-dark">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting || loading}
              className="w-full"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-tan/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-olive-dark/60">Or</span>
            </div>
          </div>

          <Button variant="outline" onClick={handleGoogle} className="w-full">
            Continue with Google
          </Button>

          {DEMO_ENABLED && (
            <>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-tan/40" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-2 text-olive-dark/60">
                    Explore without an account
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    enterDemo("user");
                    router.push("/dashboard");
                  }}
                >
                  <User className="mr-1.5 h-4 w-4" />
                  Pilot demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    enterDemo("admin");
                    router.push("/admin");
                  }}
                >
                  <Shield className="mr-1.5 h-4 w-4" />
                  Command demo
                </Button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-olive-dark/60">
            {mode === "signin" ? "Ready to unlock Pro?" : "Already have an account?"}{" "}
            {mode === "signin" ? (
              <Link href="/activate" className="font-medium text-olive hover:underline">
                Activate subscription
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-medium text-olive hover:underline"
              >
                Sign in
              </button>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageInner />;
}
