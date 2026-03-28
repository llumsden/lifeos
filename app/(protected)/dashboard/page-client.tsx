"use client";

import { Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { HabitRingCard } from "@/components/cards/habit-ring-card";
import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";
import { HabitChecklistForm } from "@/components/forms/habit-checklist-form";
import { ScheduleItemForm } from "@/components/forms/schedule-item-form";
import { PageHeader } from "@/components/layout/page-header";
import { RealtimeQuerySync } from "@/components/providers/realtime-query-sync";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CORE_HABITS, JANE_STREET_TARGET_DATE } from "@/lib/constants";
import {
  useDashboardData,
  useDeleteScheduleTemplate,
  useQuickLogHabits,
  useSaveHabitChecklist,
  useSaveScheduleTemplate,
} from "@/lib/queries";
import {
  calculateCountdownDays,
  formatDateLabel,
  formatDateLabel as formatLongDate,
  getGreeting,
  getHabitCompletionMap,
} from "@/lib/utils";
import type { DashboardPageData, WeeklyScheduleTemplateRow } from "@/types";

interface DashboardClientProps {
  userId: string;
  initialData: DashboardPageData;
}

export function DashboardClient({
  userId,
  initialData,
}: DashboardClientProps) {
  const { data } = useDashboardData(userId, initialData);
  const dashboard = data ?? initialData;
  const quickLog = useQuickLogHabits(userId);
  const saveChecklist = useSaveHabitChecklist(userId);
  const saveScheduleItem = useSaveScheduleTemplate(userId);
  const deleteScheduleItem = useDeleteScheduleTemplate(userId);

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] =
    useState<WeeklyScheduleTemplateRow | null>(null);
  const [showChecklistEditor, setShowChecklistEditor] = useState(false);

  const todayChecklist = useMemo(
    () => ({
      date: dashboard.today,
      ...getHabitCompletionMap(dashboard.habitLogs, dashboard.today),
    }),
    [dashboard.habitLogs, dashboard.today]
  );

  const countdownDays = calculateCountdownDays();
  const completedToday = Object.values(todayChecklist).filter(Boolean).length - 1;
  const timetableItems = useMemo(() => {
    const recurring = dashboard.schedule.map((item) => ({
      id: item.id,
      kind: "schedule" as const,
      title: item.title,
      details: item.details,
      timeLabel: item.time_label,
      meta: item.category ?? "Template block",
      row: item,
      position: item.position,
    }));
    const studyTasks = dashboard.studyTasks.map((task) => ({
      id: task.id,
      kind: "study_task" as const,
      title: task.title,
      details: task.details,
      timeLabel: task.time_label,
      meta: task.subject_name ? `${task.subject_name} task` : "Study task",
      row: task,
      position: task.position,
    }));

    return [...recurring, ...studyTasks].sort((left, right) => {
      const leftTime = left.timeLabel ?? "99:99";
      const rightTime = right.timeLabel ?? "99:99";

      if (leftTime !== rightTime) {
        return leftTime.localeCompare(rightTime);
      }

      return left.position - right.position;
    });
  }, [dashboard.schedule, dashboard.studyTasks]);

  return (
    <div className="space-y-8">
      <RealtimeQuerySync
        userId={userId}
        tables={["habits_log", "weekly_schedule_templates", "study_tasks"]}
        queryKeys={[["dashboard", userId], ["habits", userId]]}
      />

      <PageHeader
        eyebrow="Dashboard"
        title={`${getGreeting()}, let's make today clean.`}
        description={`Today is ${formatLongDate(
          new Date(),
          "EEEE, d MMMM yyyy"
        )}. Keep it minimal, deliberate, and stacked toward April 16, 2026.`}
        action={
          <Button
            onClick={async () => {
              await quickLog.mutateAsync(undefined);
              setShowChecklistEditor(true);
            }}
            disabled={quickLog.isPending}
          >
            <Sparkles className="mr-2 size-4" />
            {quickLog.isPending ? "Quick logging..." : "Quick-log today"}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Interview countdown"
          value={`${countdownDays} days`}
          caption={`Dynamic countdown to ${formatDateLabel(JANE_STREET_TARGET_DATE, "d MMM yyyy")}.`}
          accent="primary"
        />
        <StatCard
          label="Today's habit hits"
          value={`${Math.max(completedToday, 0)}/6`}
          caption="Quick check on your daily floor."
          accent="success"
        />
        <StatCard
          label="Hero streaks"
          value={`${dashboard.heroHabitKeys.reduce(
            (sum, key) => sum + dashboard.streaks[key],
            0
          )}`}
          caption="Combined current streak count across the four hero habits."
          accent="neutral"
        />
        <StatCard
          label="Timetable items"
          value={`${timetableItems.length}`}
          caption="Recurring schedule blocks plus scheduled study tasks."
          accent="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <SectionCard
          title="Habit command centre"
          description="Your four hero habits for today plus a full editor for the six core habits."
          action={
            <Button variant="outline" onClick={() => setShowChecklistEditor(true)}>
              <RotateCcw className="mr-2 size-4" />
              Edit today
            </Button>
          }
        >
          <HabitRingCard
            heroHabitKeys={dashboard.heroHabitKeys}
            logs={dashboard.habitLogs}
            date={dashboard.today}
          />

          {showChecklistEditor ? (
            <div className="rounded-3xl border border-white/6 bg-black/20 p-4">
              <HabitChecklistForm
                defaultValues={todayChecklist}
                onSubmit={async (values) => {
                  await saveChecklist.mutateAsync(values);
                }}
                submitLabel="Update today's checklist"
              />
            </div>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Today's timetable"
          description="Your recurring schedule plus study tasks scheduled for today."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setEditingScheduleItem(null);
                setScheduleDialogOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Add block
            </Button>
          }
        >
          <div className="space-y-3">
            {timetableItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-muted-foreground">
                Nothing scheduled for today yet.
              </div>
            ) : (
              timetableItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4"
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-indigo-200/80">
                      {item.timeLabel ?? "Flexible"}
                    </p>
                    <h3 className="mt-2 text-base font-medium text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {item.meta}
                    </p>
                    {item.details ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.details}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.kind === "schedule" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingScheduleItem(item.row);
                          setScheduleDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="rounded-full border border-emerald-500/15 bg-emerald-500/8 px-3 py-1 text-xs text-emerald-300">
                        Manage in Study
                      </div>
                    )}
                    {item.kind === "schedule" && !item.id.startsWith("fallback-") ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteScheduleItem.mutate(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <SectionCard
          title="Weekly streak counters"
          description="Current consecutive-day streak for each core habit."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {CORE_HABITS.map((habit) => (
              <div
                key={habit.key}
                className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4"
              >
                <p className="text-sm text-muted-foreground">{habit.shortLabel}</p>
                <p className="mono-numeric mt-2 text-3xl font-semibold text-white">
                  {dashboard.streaks[habit.key]}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">days in a row</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Study queue"
          description="Tasks scheduled for today so the dashboard doubles as your live timetable."
        >
          <div className="space-y-3">
            {dashboard.studyTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-muted-foreground">
                No study tasks are scheduled for today yet.
              </div>
            ) : (
              dashboard.studyTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-indigo-200/80">
                    {task.time_label ?? "Flexible"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white">{task.title}</p>
                  {task.subject_name ? (
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {task.subject_name}
                    </p>
                  ) : null}
                  {task.details ? (
                    <p className="mt-2 text-sm text-muted-foreground">{task.details}</p>
                  ) : null}
                </div>
                <div className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-xs text-muted-foreground">
                  Study
                </div>
              </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-xl border border-white/10 bg-popover">
          <DialogHeader>
            <DialogTitle>
              {editingScheduleItem ? "Edit schedule block" : "Add schedule block"}
            </DialogTitle>
          </DialogHeader>
          <ScheduleItemForm
            defaultValues={{
              schedule_type: "dashboard",
              weekday: editingScheduleItem?.weekday ?? new Date().getDay(),
              title: editingScheduleItem?.title ?? "",
              details: editingScheduleItem?.details ?? "",
              time_label: editingScheduleItem?.time_label ?? "",
              category: editingScheduleItem?.category ?? "study",
              position:
                editingScheduleItem?.position ??
                Math.max(dashboard.schedule.length + 1, 1),
            }}
            onSubmit={async (values) => {
              await saveScheduleItem.mutateAsync({
                id: editingScheduleItem?.id,
                ...values,
              });
              setScheduleDialogOpen(false);
              setEditingScheduleItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
