"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getGradeTrend } from "@/lib/utils";
import type { ClimbingSessionRow } from "@/types";

interface GradeTrendChartProps {
  sessions: ClimbingSessionRow[];
}

export function GradeTrendChart({ sessions }: GradeTrendChartProps) {
  const data = getGradeTrend(sessions);

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-muted-foreground">
        Log a few comparable grades to unlock the trend view.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#888"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke="#888"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <Tooltip
            formatter={(_, __, item) => item?.payload?.label ?? "N/A"}
            contentStyle={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 3, fill: "#22c55e" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
