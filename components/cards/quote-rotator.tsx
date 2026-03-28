"use client";

import { useEffect } from "react";
import { Quote } from "lucide-react";

import { useUIStore } from "@/hooks/use-ui-store";
import type { MotivationalQuoteRow } from "@/types";

interface QuoteRotatorProps {
  quotes: MotivationalQuoteRow[];
}

export function QuoteRotator({ quotes }: QuoteRotatorProps) {
  const activeQuoteIndex = useUIStore((state) => state.activeQuoteIndex);
  const setActiveQuoteIndex = useUIStore((state) => state.setActiveQuoteIndex);

  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveQuoteIndex((activeQuoteIndex + 1) % quotes.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [activeQuoteIndex, quotes.length, setActiveQuoteIndex]);

  const activeQuote = quotes[activeQuoteIndex % Math.max(quotes.length, 1)];

  if (!activeQuote) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/15 via-white/[0.03] to-transparent p-6">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_65%)]" />
      <div className="relative space-y-4">
        <div className="flex items-center gap-3 text-indigo-200">
          <div className="rounded-full border border-indigo-400/20 bg-indigo-400/10 p-2">
            <Quote className="size-4" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-indigo-200/80">
            Momentum
          </p>
        </div>
        <blockquote className="max-w-3xl text-xl font-medium leading-8 text-white">
          “{activeQuote.quote}”
        </blockquote>
        {activeQuote.author ? (
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {activeQuote.author}
          </p>
        ) : null}
      </div>
    </div>
  );
}
