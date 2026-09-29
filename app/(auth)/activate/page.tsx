"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HudCard, InsigniaBadge } from "@/components/military";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api-client";
import { PLANS, type PlanId } from "@/lib/plans";
import { registrationSchema, US_STATES, type RegistrationInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const features = [
  "Cloud sync across devices",
  "Full quiz history and analytics",
  "Weak-area insights",
  "Priority updates and new questions",
];

const experienceOptions: { value: RegistrationInput["experience"]; label: string }[] = [
  { value: "none", label: "No experience yet" },
  { value: "hobbyist", label: "Hobbyist flyer" },
  { value: "some_commercial", label: "Some commercial flying" },
  { value: "military", label: "Military UAS experience" },
  { value: "professional", label: "Professional remote pilot" },
];

const referralOptions: { value: RegistrationInput["referralSource"]; label: string }[] = [
  { value: "search", label: "Search engine" },
  { value: "social", label: "Social media" },
  { value: "friend", label: "Friend or colleague" },
  { value: "military_unit", label: "Military unit" },
  { value: "employer", label: "Employer" },
  { value: "other", label: "Other" },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

type Errors = Partial<Record<string, string>>;

function PlanSelector({
  planId,
  onSelect,
}: {
  planId: PlanId;
  onSelect: (id: PlanId) => void;
}) {
  return (
    <div className="space-y-4">
      <div role="radiogroup" aria-label="Choose a plan" className="space-y-4">
        {PLANS.map((plan) => {
          const selected = plan.id === planId;
          return (
            <HudCard
              key={plan.id}
              role="radio"
              aria-checked={selected}
              tabIndex={0}
              onClick={() => onSelect(plan.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(plan.id);
                }
              }}
              className={cn(
                "cursor-pointer p-5 transition-all",
                selected && "border-olive ring-2 ring-olive"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-olive-dark">{plan.name}</span>
                    {plan.badge && <InsigniaBadge variant="pro">{plan.badge}</InsigniaBadge>}
                  </div>
                  <p className="mt-1 text-sm text-olive-dark/60">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {formatPrice(plan.priceCents)}
                    {plan.mode === "subscription" && (
                      <span className="text-sm font-normal text-olive-dark/60">/mo</span>
                    )}
                  </div>
                  {plan.mode === "payment" && (
                    <div className="text-xs text-olive-dark/60">
                      ≈ {formatPrice(plan.perMonthCents)}/mo
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-olive-dark/60">
                <span className="inline-flex items-center gap-1 rounded-full border border-tan/40 bg-surface-2 px-2 py-0.5">
                  <CreditCard className="h-3 w-3" /> Card
                </span>
                {plan.bnpl && (
                  <span className="inline-flex items-center rounded-full border border-tan/40 bg-surface-2 px-2 py-0.5">
                    Buy Now, Pay Later: Klarna · Affirm · Afterpay
                  </span>
                )}
              </div>
            </HudCard>
          );
        })}
      </div>

      <ul className="space-y-2 pt-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-olive-dark/80">
            <Check className="mt-0.5 h-4 w-4 text-olive" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivatePageInner() {
  const searchParams = useSearchParams();
  const { user, profile, loading: authLoading } = useAuth();
  const [planId, setPlanId] = React.useState<PlanId>("monthly");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    experience: "",
    targetExamDate: "",
    referralSource: "",
  });

  const [prefilled, setPrefilled] = React.useState(false);
  if (user && !prefilled) {
    setPrefilled(true);
    setForm((f) => ({
      ...f,
      email: f.email || user.email || "",
      fullName: f.fullName || user.displayName || "",
    }));
  }

  React.useEffect(() => {
    if (searchParams.get("checkout") === "cancel") {
      toast.info("Checkout canceled — pick a plan whenever you are ready.");
    }
  }, [searchParams]);

  const selectedPlan = PLANS.find((p) => p.id === planId) ?? PLANS[0];

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const fieldError = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} className="text-xs text-danger">
        {errors[key]}
      </p>
    ) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registrationSchema.safeParse({
      ...form,
      targetExamDate: form.targetExamDate || null,
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ planId, registration: parsed.data }),
      });
      window.location.href = url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <div className="text-center">
          <h1 className="stencil text-4xl tracking-tight text-olive-dark">Enlist in Pro</h1>
          <p className="mt-3 text-lg text-olive-dark/70">
            Choose your access plan, then sign in to complete registration.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <PlanSelector planId={planId} onSelect={setPlanId} />
          <Card className="relative overflow-hidden pt-2">
            <div className="hazard-stripe absolute inset-x-0 top-0" aria-hidden="true" />
            <CardHeader>
              <CardTitle className="text-olive-dark">Student registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-olive-dark/70">
                Sign in or create a free account to activate a Pro plan.
              </p>
              <Link href="/login?next=/activate">
                <Button className="w-full" disabled={authLoading}>
                  Sign in to continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (profile?.subscriptionStatus === "active") {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="stencil text-center text-olive-dark">Enlist in Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="rounded-lg bg-olive/10 p-4 text-sm font-medium text-olive-dark">
              Your Pro subscription is active.
            </div>
            <Link href="/dashboard">
              <Button className="w-full">Go to dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <div className="text-center">
        <h1 className="stencil text-4xl tracking-tight text-olive-dark">Enlist in Pro</h1>
        <p className="mt-3 text-lg text-olive-dark/70">
          Choose your access plan and complete registration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
        {/* Plan selector */}
        <PlanSelector planId={planId} onSelect={setPlanId} />

        {/* Registration form */}
        <Card className="relative overflow-hidden pt-2">
          <div className="hazard-stripe absolute inset-x-0 top-0" aria-hidden="true" />
          <CardHeader>
            <CardTitle className="text-olive-dark">Student registration</CardTitle>
            <p className="text-sm text-olive-dark/60">Required for your training record.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={form.fullName} onChange={set("fullName")} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
              {fieldError("fullName")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="regEmail">Email</Label>
              <Input id="regEmail" type="email" value={form.email} onChange={set("email")} aria-describedby={errors.email ? "email-error" : undefined} />
              {fieldError("email")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={set("phone")} aria-describedby={errors.phone ? "phone-error" : undefined} />
              {fieldError("phone")}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={set("city")} aria-describedby={errors.city ? "city-error" : undefined} />
                {fieldError("city")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  value={form.state}
                  onChange={set("state")}
                  aria-describedby={errors.state ? "state-error" : undefined}
                  className="w-full rounded-md border border-tan/60 bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-olive"
                >
                  <option value="">Select…</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {fieldError("state")}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="experience">Drone experience</Label>
              <select
                id="experience"
                value={form.experience}
                onChange={set("experience")}
                aria-describedby={errors.experience ? "experience-error" : undefined}
                className="w-full rounded-md border border-tan/60 bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-olive"
              >
                <option value="">Select…</option>
                {experienceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {fieldError("experience")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetExamDate">Target exam date (optional)</Label>
              <Input id="targetExamDate" type="date" value={form.targetExamDate} onChange={set("targetExamDate")} aria-describedby={errors.targetExamDate ? "targetExamDate-error" : undefined} />
              {fieldError("targetExamDate")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <select
                id="referralSource"
                value={form.referralSource}
                onChange={set("referralSource")}
                aria-describedby={errors.referralSource ? "referralSource-error" : undefined}
                className="w-full rounded-md border border-tan/60 bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-olive"
              >
                <option value="">Select…</option>
                {referralOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {fieldError("referralSource")}
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting
                ? "Redirecting to checkout…"
                : `Continue to secure checkout — ${formatPrice(selectedPlan.priceCents)}`}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-olive-dark/60">
              <Lock className="h-3 w-3" />
              Payments processed by Stripe. BNPL availability is determined at checkout by Stripe.
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <React.Suspense fallback={null}>
      <ActivatePageInner />
    </React.Suspense>
  );
}
