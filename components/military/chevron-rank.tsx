import { cn } from "@/lib/utils";

export function getRank(readiness: number): { level: 1 | 2 | 3 | 4; label: string } {
  if (readiness < 25) return { level: 1, label: "Recruit" };
  if (readiness < 50) return { level: 2, label: "Operator" };
  if (readiness < 75) return { level: 3, label: "Specialist" };
  return { level: 4, label: "Mission-Ready" };
}

export function ChevronRank({
  readiness,
  dark = false,
  className,
}: {
  readiness: number;
  dark?: boolean;
  className?: string;
}) {
  const rank = getRank(readiness);
  const chevrons = [0, 1, 2, 3];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 48 56"
        className="h-10 w-9"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        {chevrons.map((i) => {
          const lit = i < rank.level;
          const y = 44 - i * 12;
          return (
            <path
              key={i}
              d={`M8 ${y} L24 ${y - 8} L40 ${y} L40 ${y - 6} L24 ${y - 14} L8 ${y - 6} Z`}
              className={lit ? "fill-olive-light" : dark ? "fill-white/15" : "fill-olive/20"}
            />
          );
        })}
      </svg>
      <div className="leading-tight">
        <div
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            dark ? "text-tan-light/60" : "text-olive-dark/60"
          )}
        >
          Rank
        </div>
        <div className={cn("stencil text-sm", dark ? "text-tan-light" : "text-olive-dark")}>
          {rank.label}
        </div>
      </div>
    </div>
  );
}
