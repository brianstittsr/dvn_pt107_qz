"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsigniaBadge } from "@/components/military";
import { useAuth } from "@/components/auth-provider";

interface UserRecord {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  subscriptionStatus: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [users, setUsers] = React.useState<UserRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authLoading) return;
    if (profile?.role !== "admin") {
      router.replace("/admin");
      return;
    }
    fetch("/api/admin/users")
      .then(async (res) => {
        const json = (await res.json()) as { data?: UserRecord[]; error?: string };
        if (!res.ok) throw new Error(json.error ?? "Failed to load users");
        setUsers(json.data ?? []);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [authLoading, profile, router]);

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-olive-dark/60">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading user roster…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="py-6 text-danger">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <h1 className="stencil text-2xl tracking-tight text-olive-dark">User Roster</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-olive-dark">
            <Users className="h-5 w-5 text-olive" />
            Registered users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tan/40 bg-surface-2 text-left text-olive-dark/70">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Subscription</th>
                  <th className="px-3 py-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="border-b border-tan/20 text-foreground last:border-0">
                    <td className="px-3 py-3 font-medium">{user.displayName || "—"}</td>
                    <td className="px-3 py-3 text-olive-dark/70">{user.email || "—"}</td>
                    <td className="px-3 py-3">
                      <InsigniaBadge variant={user.role === "admin" ? "admin" : "neutral"}>
                        {user.role}
                      </InsigniaBadge>
                    </td>
                    <td className="px-3 py-3">
                      <InsigniaBadge variant={user.subscriptionStatus === "active" ? "pro" : "free"}>
                        {user.subscriptionStatus}
                      </InsigniaBadge>
                    </td>
                    <td className="px-3 py-3 text-olive-dark/50">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
