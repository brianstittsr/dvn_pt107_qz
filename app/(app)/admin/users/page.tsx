"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex h-full items-center justify-center gap-2 text-tan-light/60">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading user roster…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="border-olive-dark/40 text-tan-light hover:bg-card-2">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <Card className="border-red-900/30 bg-red-950/10 text-foreground">
          <CardContent className="py-6 text-red-400">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="border-olive-dark/40 text-tan-light hover:bg-card-2">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-tan-light">User Roster</h1>
      </div>

      <Card className="border-olive-dark/40 bg-card text-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tan-light">
            <Users className="h-5 w-5 text-olive-light" />
            Registered users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-olive-dark/40 text-left text-tan-light/60">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Email</th>
                  <th className="pb-2 pr-4 font-medium">Role</th>
                  <th className="pb-2 pr-4 font-medium">Subscription</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="border-b border-olive-dark/20 text-tan-light last:border-0">
                    <td className="py-3 pr-4 font-medium">{user.displayName || "—"}</td>
                    <td className="py-3 pr-4 text-tan-light/70">{user.email || "—"}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-olive-dark/20 text-olive-light"
                            : "bg-card-2 text-tan-light/60"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.subscriptionStatus === "active"
                            ? "bg-olive-dark/20 text-olive-light"
                            : "bg-card-2 text-tan-light/60"
                        }`}
                      >
                        {user.subscriptionStatus}
                      </span>
                    </td>
                    <td className="py-3 text-tan-light/50">
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
