import { CheckCircle2 } from "lucide-react";

import { CORE_HABITS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { HabitKey, HabitLogRow } from "@/types";

interface HabitRingCardProps {
  heroHabitKeys: HabitKey[];
  logs: HabitLogRow[];
  date: string;
}

export function HabitRingCard({
  heroHabitKeys,
  logs,
  date,
}: HabitRingCardProps) {
  const completed = new Set(
    logs.filter((log) => log.date === date && log.completed).map((log) => log.habit_key)
  );
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / heroHabitKeys.length;
  const gap = 10;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px,1fr] lg:items-center">
      <div className="relative mx-auto size-56">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
            fill="none"
          />
          {heroHabitKeys.map((habitKey, index) => {
            const isComplete = completed.has(habitKey);
            const dashOffset = index * segmentLength;

            return (
              <circle
                key={habitKey}
                cx="70"
                cy="70"
                r={radius}
                stroke={isComplete ? "var(--success)" : "rgba(255,255,255,0.14)"}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${segmentLength - gap} ${circumference}`}
                strokeDashoffset={-dashOffset}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Today
          </p>
          <p className="mono-numeric mt-2 text-5xl font-semibold text-white">
            {heroHabitKeys.filter((key) => completed.has(key)).length}/{heroHabitKeys.length}
          </p>
          <p className="mt-2 max-w-[10rem] text-sm text-muted-foreground">
            Hero habits landed.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {heroHabitKeys.map((habitKey) => {
          const habit = CORE_HABITS.find((entry) => entry.key === habitKey);
          if (!habit) return null;

          const done = completed.has(habitKey);

          return (
            <div
              key={habitKey}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors",
                done
                  ? "border-emerald-500/20 bg-emerald-500/8"
                  : "border-white/6 bg-white/[0.02]"
              )}
            >
              <div>
                <p className="font-medium text-white">{habit.shortLabel}</p>
                <p className="text-sm text-muted-foreground">{habit.description}</p>
              </div>
              <CheckCircle2
                className={cn(
                  "size-5",
                  done ? "text-emerald-400" : "text-muted-foreground"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
