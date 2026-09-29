import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left")}>
      {eyebrow && (
        <p
          className={cn(
            "stencil text-xs",
            dark ? "text-olive-light" : "text-olive"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "stencil mt-2 text-3xl tracking-tight",
          dark ? "text-white" : "text-olive-dark"
        )}
      >
        {title}
      </h2>
      <div className={cn("hazard-stripe mt-4 w-12", align === "center" && "mx-auto")} />
      {description && (
        <p className={cn("mt-4", dark ? "text-tan-light/80" : "text-olive-dark/70")}>
          {description}
        </p>
      )}
    </div>
  );
}
