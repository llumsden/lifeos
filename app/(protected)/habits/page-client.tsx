"use client";

import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";
import { HabitHeatmap } from "@/components/cards/habit-heatmap";
import { HabitChecklistForm } from "@/components/forms/habit-checklist-form";
import { WeeklyReviewForm } from "@/components/forms/weekly-review-form";
import { PageHeader } from "@/components/layout/page-header";
import { RealtimeQuerySync } from "@/components/providers/realtime-query-sync";
import {
  useHabitsData,
  usePendingWeeklyReview,
  useSaveHabitChecklist,
  useSaveWeeklyReview,
} from "@/lib/queries";
import {
  calculateHabitStreaks,
  getHabitCompletionMap,
  startOfWeekISO,
} from "@/lib/utils";
import type { HabitsPageData } from "@/types";

interface HabitsClientProps {
  userId: string;
  initialData: HabitsPageData;
}

export function HabitsClient({ userId, initialData }: HabitsClientProps) {
  const { data } = useHabitsData(userId, initialData);
  const habits = data ?? initialData;
  const pendingReview = usePendingWeeklyReview(userId);
  const saveChecklist = useSaveHabitChecklist(userId);
  const saveReview = useSaveWeeklyReview(userId);
  const streaks = calculateHabitStreaks(habits.habitLogs);
  const todayChecklist = {
    date: habits.today,
    ...getHabitCompletionMap(habits.habitLogs, habits.today),
  };

  return (
    <div className="space-y-8">
      <RealtimeQuerySync
        userId={userId}
        tables={["habits_log", "weekly_reviews"]}
        queryKeys={[["habits", userId], ["review", userId], ["dashboard", userId]]}
      />

      <PageHeader
        eyebrow="Habits"
        title="Build the floor so hard days still count."
        description="Track the six core habits daily, then use the heatmap and weekly review loop to keep the system honest."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(streaks).slice(0, 3).map(([key, value]) => (
          <StatCard
            key={key}
            label={key.replaceAll("_", " ")}
            value={`${value}`}
            caption="Current streak"
            accent="success"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <SectionCard
          title="Today's checklist"
          description="Every day gets a clean pass or a clean miss. Save it either way."
        >
          <HabitChecklistForm
            defaultValues={todayChecklist}
            onSubmit={async (values) => {
              await saveChecklist.mutateAsync(values);
            }}
          />
        </SectionCard>

        <SectionCard
          title="Sunday review"
          description="The modal opens automatically on Sunday, but you can also write it here."
        >
          <WeeklyReviewForm
            defaultValues={{
              week_start: pendingReview.data?.week_start ?? startOfWeekISO(),
              went_well: "",
              slipped: "",
              plan_next_week: "",
              rating: 4,
            }}
            onSubmit={async (values) => {
              await saveReview.mutateAsync(values);
            }}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="12-month habit heatmap"
        description="One square per day. Intensity reflects how many of the six habits landed."
      >
        <HabitHeatmap logs={habits.habitLogs} />
      </SectionCard>
    </div>
  );
}
