import { cn } from "@/lib/utils";

const variantClasses: Record<"pro" | "admin" | "free" | "neutral", string> = {
  pro: "border-olive bg-olive/10 text-olive-dark shadow-[inset_0_0_0_1px_var(--olive)]",
  admin: "border-navy bg-navy text-tan-light shadow-[inset_0_0_0_1px_var(--tan-light)]",
  free: "border-tan bg-surface-2 text-olive-dark shadow-[inset_0_0_0_1px_var(--tan)]",
  neutral:
    "border-surface-2 bg-surface-2 text-olive-dark shadow-[inset_0_0_0_1px_var(--olive-dark)]",
};

export function InsigniaBadge({
  variant,
  children,
  className,
}: {
  variant: "pro" | "admin" | "free" | "neutral";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
