import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function HudCard({
  dark = false,
  className,
  ...props
}: React.ComponentProps<typeof Card> & { dark?: boolean }) {
  return (
    <Card
      className={cn(
        "hud-corners",
        dark && "border-tan-light/30 bg-navy text-tan-light",
        className
      )}
      {...props}
    />
  );
}
