import { getCompletionIntensity, getWeekColumnsForHeatmap } from "@/lib/utils";
import type { HabitLogRow } from "@/types";

interface HabitHeatmapProps {
  logs: HabitLogRow[];
}

export function HabitHeatmap({ logs }: HabitHeatmapProps) {
  const weeks = getWeekColumnsForHeatmap(logs);

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1">
        {weeks.map((week, index) => (
          <div key={index} className="grid gap-1">
            {week.map((cell) => (
              <div
                key={cell.date}
                title={`${cell.label}: ${cell.count} habits hit`}
                className={`size-3 rounded-[4px] ${getCompletionIntensity(cell.count)} ${
                  cell.placeholder ? "opacity-30" : ""
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
