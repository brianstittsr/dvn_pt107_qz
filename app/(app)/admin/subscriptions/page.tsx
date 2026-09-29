"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsigniaBadge } from "@/components/military";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api-client";
import { DEMO_SUBSCRIPTIONS, applyDemoSubscriptionAction } from "@/lib/demo-data";
import { PLANS, getPlan, type PlanId } from "@/lib/plans";
import { toast } from "sonner";

interface SubscriptionRow {
  uid: string;
  email: string | null;
  displayName: string | null;
  planId: PlanId | null;
  subscriptionStatus: string;
  subscriptionExpiry: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

const statusVariant: Record<string, "pro" | "danger" | "neutral" | "free"> = {
  active: "pro",
  past_due: "danger",
  canceled: "neutral",
  inactive: "free",
};

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString() : "—";
}

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const { effectiveProfile, demo, loading: authLoading } = useAuth();
  const [rows, setRows] = React.useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busyUid, setBusyUid] = React.useState<string | null>(null);
  const [confirmRevokeUid, setConfirmRevokeUid] = React.useState<string | null>(null);
  const [grantPlan, setGrantPlan] = React.useState<Record<string, PlanId>>({});

  const fetchRows = React.useCallback(() => {
    if (demo) {
      // Defer fixture state out of the effect body (react-hooks/set-state-in-effect).
      return Promise.resolve().then(() => {
        setRows(DEMO_SUBSCRIPTIONS.map((row) => ({ ...row })));
        setLoading(false);
      });
    }
    return apiFetch<SubscriptionRow[]>("/api/admin/subscriptions")
      .then(setRows)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [demo]);

  React.useEffect(() => {
    if (authLoading) return;
    if (effectiveProfile?.role !== "admin") {
      router.replace("/admin");
      return;
    }
    void fetchRows();
  }, [authLoading, effectiveProfile, router, fetchRows]);

  const act = async (uid: string, action: string, planId?: PlanId) => {
    setBusyUid(uid);
    try {
      if (demo) {
        // Demo mode — no API calls, just mutate the local fixture copy.
        toast.info("Demo mode — changes aren't saved");
        setRows((prev) => applyDemoSubscriptionAction(prev, uid, action, planId));
        return;
      }
      await apiFetch(`/api/admin/subscriptions/${uid}`, {
        method: "POST",
        body: JSON.stringify({ action, planId }),
      });
      toast.success(`Action "${action}" applied.`);
      await fetchRows();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyUid(null);
      setConfirmRevokeUid(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-olive-dark/60">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading subscriptions…
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
        <h1 className="stencil text-2xl tracking-tight text-olive-dark">Subscriptions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-olive-dark">
            <BadgeCheck className="h-5 w-5 text-olive" />
            Plan access ({rows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tan/40 bg-surface-2 text-left text-olive-dark/70">
                  <th className="px-3 py-2 font-medium">Student</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Expiry / Renewal</th>
                  <th className="px-3 py-2 font-medium">Auto-renew</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const monthly = row.planId === "monthly" && row.stripeSubscriptionId;
                  const busy = busyUid === row.uid;
                  return (
                    <tr key={row.uid} className="border-b border-tan/20 text-foreground last:border-0">
                      <td className="px-3 py-3">
                        <div className="font-medium">{row.displayName || "—"}</div>
                        <div className="text-xs text-olive-dark/60">{row.email}</div>
                      </td>
                      <td className="px-3 py-3">
                        {row.planId ? getPlan(row.planId).name : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <InsigniaBadge variant={statusVariant[row.subscriptionStatus] ?? "free"}>
                          {row.subscriptionStatus.replace("_", " ")}
                        </InsigniaBadge>
                      </td>
                      <td className="px-3 py-3 text-olive-dark/70">
                        {formatDate(row.subscriptionExpiry)}
                      </td>
                      <td className="px-3 py-3 text-olive-dark/70">
                        {monthly ? (row.cancelAtPeriodEnd ? "No" : "Yes") : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {monthly && !row.cancelAtPeriodEnd && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={busy}
                              onClick={() => act(row.uid, "cancel")}
                            >
                              Cancel at period end
                            </Button>
                          )}
                          {monthly && row.cancelAtPeriodEnd && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={busy}
                              onClick={() => act(row.uid, "resume")}
                            >
                              Resume
                            </Button>
                          )}
                          {confirmRevokeUid === row.uid ? (
                            <>
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={busy}
                                onClick={() => act(row.uid, "revoke")}
                              >
                                Confirm revoke
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={busy}
                                onClick={() => setConfirmRevokeUid(null)}
                              >
                                Keep
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={busy}
                              onClick={() => setConfirmRevokeUid(row.uid)}
                            >
                              Revoke
                            </Button>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <select
                              aria-label="Plan to grant"
                              value={grantPlan[row.uid] ?? "sixMonth"}
                              onChange={(e) =>
                                setGrantPlan((g) => ({ ...g, [row.uid]: e.target.value as PlanId }))
                              }
                              className="rounded-md border border-tan/60 bg-white px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-olive"
                            >
                              {PLANS.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={busy}
                              onClick={() => act(row.uid, "grant", grantPlan[row.uid] ?? "sixMonth")}
                            >
                              Grant access
                            </Button>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-olive-dark/60">
                      No subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
