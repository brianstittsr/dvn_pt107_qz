"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HudCard, InsigniaBadge } from "@/components/military";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api-client";
import { getPlan, type PlanId } from "@/lib/plans";
import type { PaymentRecord } from "@/lib/types";

interface PaymentsData {
  payments: PaymentRecord[];
  summary: {
    totalCents: number;
    succeededCount: number;
    failedCount: number;
    refundedCount: number;
  };
}

const statusVariant: Record<PaymentRecord["status"], "pro" | "danger" | "neutral" | "free"> = {
  succeeded: "pro",
  failed: "danger",
  refunded: "neutral",
  pending: "free",
};

function money(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [data, setData] = React.useState<PaymentsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authLoading) return;
    if (profile?.role !== "admin") {
      router.replace("/admin");
      return;
    }
    apiFetch<PaymentsData>("/api/admin/payments")
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [authLoading, profile, router]);

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-olive-dark/60">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading payment records…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="py-6 text-danger">{error ?? "No data available"}</CardContent>
        </Card>
      </div>
    );
  }

  const metrics = [
    { label: "Total revenue", value: money(data.summary.totalCents) },
    { label: "Succeeded", value: data.summary.succeededCount },
    { label: "Failed", value: data.summary.failedCount },
    { label: "Refunded", value: data.summary.refundedCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <h1 className="stencil text-2xl tracking-tight text-olive-dark">Payments</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <HudCard key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase text-olive-dark/60">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metric.value}</div>
            </CardContent>
          </HudCard>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-olive-dark">
            <CreditCard className="h-5 w-5 text-olive" />
            Payment records ({data.payments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tan/40 bg-surface-2 text-left text-olive-dark/70">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Student</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Method</th>
                  <th className="px-3 py-2 font-medium">Kind</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr key={p.id} className="border-b border-tan/20 text-foreground last:border-0">
                    <td className="px-3 py-3 text-olive-dark/70">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 text-olive-dark/70">{p.email ?? p.userId}</td>
                    <td className="px-3 py-3">
                      {p.planId ? getPlan(p.planId as PlanId).name : "—"}
                    </td>
                    <td className="px-3 py-3 font-medium">{money(p.amountCents)}</td>
                    <td className="px-3 py-3 capitalize text-olive-dark/70">
                      {p.paymentMethodType ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-olive-dark/70">
                      {p.kind === "one_time" ? "One-time" : "Invoice"}
                    </td>
                    <td className="px-3 py-3">
                      <InsigniaBadge variant={statusVariant[p.status]}>{p.status}</InsigniaBadge>
                    </td>
                  </tr>
                ))}
                {data.payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-olive-dark/60">
                      No payments recorded yet.
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
