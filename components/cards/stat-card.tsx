import type { ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  caption?: string;
  icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "neutral";
  className?: string;
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "from-indigo-500/25 to-transparent",
  success: "from-emerald-500/20 to-transparent",
  warning: "from-amber-500/20 to-transparent",
  neutral: "from-slate-400/10 to-transparent dark:from-white/5",
};

export function StatCard({
  label,
  value,
  caption,
  icon = <ArrowUpRight className="size-4" />,
  accent = "neutral",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border border-white/6 bg-white/[0.02] ring-0 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:shadow-none",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100",
          accentClasses[accent]
        )}
      />
      <CardHeader className="relative z-10 flex flex-row items-start justify-between space-y-0">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            {label}
          </p>
          <CardTitle className="mt-3 text-3xl font-semibold tracking-tight">
            {value}
          </CardTitle>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      {caption ? (
        <CardContent className="relative z-10 pt-0 text-sm text-muted-foreground">
          {caption}
        </CardContent>
      ) : null}
    </Card>
  );
}
