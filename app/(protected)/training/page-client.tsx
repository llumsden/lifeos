"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";
import { GradeTrendChart } from "@/components/charts/grade-trend-chart";
import { BodyGoalForm } from "@/components/forms/body-goal-form";
import { ClimbingSessionForm } from "@/components/forms/climbing-session-form";
import { GymSessionForm } from "@/components/forms/gym-session-form";
import { ScheduleItemForm } from "@/components/forms/schedule-item-form";
import { WorkoutTemplateForm } from "@/components/forms/workout-template-form";
import { PageHeader } from "@/components/layout/page-header";
import { RealtimeQuerySync } from "@/components/providers/realtime-query-sync";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CLIMBING_POWER_PLAN, CLIMBING_POWER_RULES } from "@/lib/constants";
import {
  useDeleteScheduleTemplate,
  useSaveClimbingSession,
  useSaveGymSession,
  useSaveScheduleTemplate,
  useSaveWorkoutTemplate,
  useTrainingData,
  useUpdateProfile,
} from "@/lib/queries";
import {
  calculateCountdownDays,
  formatDateLabel,
  getClimbingWeeklySummary,
  getProgressiveOverloadFlags,
} from "@/lib/utils";
import type {
  GymWorkoutTemplateRow,
  TrainingPageData,
  WeeklyScheduleTemplateRow,
} from "@/types";

interface TrainingClientProps {
  userId: string;
  initialData: TrainingPageData;
}

export function TrainingClient({
  userId,
  initialData,
}: TrainingClientProps) {
  const { data } = useTrainingData(userId, initialData);
  const training = data ?? initialData;
  const saveClimbingSession = useSaveClimbingSession(userId);
  const saveGymSession = useSaveGymSession(userId);
  const saveWorkoutTemplate = useSaveWorkoutTemplate(userId);
  const updateProfile = useUpdateProfile(userId);
  const saveSchedule = useSaveScheduleTemplate(userId);
  const deleteSchedule = useDeleteScheduleTemplate(userId);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<GymWorkoutTemplateRow | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<WeeklyScheduleTemplateRow | null>(null);

  const weeklySummary = getClimbingWeeklySummary(training.climbingSessions);
  const overloadFlags = getProgressiveOverloadFlags(training.gymSessions);
  const countdownDays = calculateCountdownDays();

  const workoutTemplates = training.workoutTemplates.map((template) => ({
    label: template.name,
    sessionType: template.name.includes("B") ? "B" : "A",
    exercises: template.exercises,
  })) as Array<{
    label: string;
    sessionType: "A" | "B";
    exercises: typeof training.workoutTemplates[number]["exercises"];
  }>;

  const weeklySchedule = useMemo(
    () =>
      Array.from({ length: 7 }, (_, weekday) => ({
        weekday,
        items: training.schedule.filter((item) => item.weekday === weekday),
      })),
    [training.schedule]
  );

  return (
    <div className="space-y-8">
      <RealtimeQuerySync
        userId={userId}
        tables={[
          "climbing_sessions",
          "gym_sessions",
          "gym_workout_templates",
          "weekly_schedule_templates",
          "user_profiles",
        ]}
        queryKeys={[["training", userId], ["dashboard", userId]]}
      />

      <PageHeader
        eyebrow="Training"
        title="Stay strong, stay fresh, don't burn the study sprint."
        description="Climbing and gym work stay high quality, but the volume cap respects the Jane Street runway."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setEditingTemplate(null);
              setTemplateDialogOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Add workout template
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Climbing sessions this week"
          value={`${weeklySummary.totalSessions}`}
          caption="Cap at 3 before April 16, then open it up to 4."
          accent="success"
        />
        <StatCard
          label="Average energy"
          value={weeklySummary.avgEnergy.toFixed(1)}
          caption="Recent climbing energy rating."
          accent="neutral"
        />
        <StatCard
          label="Weight goal"
          value={`${training.profile?.current_weight_kg ?? 70}kg -> ${
            training.profile?.target_weight_kg ?? 76
          }kg`}
          caption={`${training.profile?.height_cm ?? 183}cm. Progressive overload, not cardio.`}
          accent="warning"
        />
        <StatCard
          label="Sprint mode"
          value={countdownDays > 0 ? "3 sessions" : "4 sessions"}
          caption={
            countdownDays > 0
              ? "Stay inside the pre-interview climbing cap."
              : "Interview done. You can add a fourth session."
          }
          accent="primary"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <SectionCard
          title="Climbing log"
          description="Technique, strength, project, endurance, or recovery."
        >
          <ClimbingSessionForm
            defaultValues={{
              date: training.today,
              session_type: "technique",
              grade_achieved: "",
              volume: 8,
              energy_level: 4,
              notes: "",
            }}
            onSubmit={async (values) => {
              await saveClimbingSession.mutateAsync(values);
            }}
          />
        </SectionCard>

        <SectionCard
          title="Climbing trend"
          description="Grade history when your logged grades are comparable."
        >
          <GradeTrendChart sessions={training.climbingSessions} />
        </SectionCard>
      </div>

      <SectionCard
        title="7-day power plan"
        description="A force-velocity block biased hard toward explosiveness, motor-unit recruitment, and clean rate of force development."
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-3">
            <div className="rounded-3xl border border-indigo-500/15 bg-indigo-500/8 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-indigo-200/80">
                Intent
              </p>
              <p className="mt-2 text-sm leading-7 text-white">
                Shift the curve toward the extreme left of the force-velocity continuum.
                This block is about explosive output, high-threshold recruitment, and
                brutal honesty with recovery.
              </p>
            </div>

            {CLIMBING_POWER_RULES.map((rule) => (
              <div
                key={rule.title}
                className="rounded-3xl border border-white/6 bg-white/[0.02] p-4"
              >
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {rule.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-white">{rule.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3">
            {CLIMBING_POWER_PLAN.map((day) => (
              <div
                key={day.day}
                className="rounded-3xl border border-white/6 bg-white/[0.02] p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-indigo-200/80">
                    {day.day}
                  </p>
                  <div className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-xs text-muted-foreground">
                    {day.subtitle}
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{day.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{day.job}</p>
                <div className="mt-4 space-y-2">
                  {day.blocks.map((block) => (
                    <div
                      key={block}
                      className="rounded-2xl border border-white/6 bg-black/20 px-3 py-3 text-sm leading-6 text-white"
                    >
                      {block}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <SectionCard
          title="Gym log"
          description="Full Body A / B with editable exercise rows and template loading."
        >
          <GymSessionForm
            defaultValues={{
              date: training.today,
              session_type: "A",
              exercises:
                workoutTemplates[0]?.exercises ?? [
                  {
                    name: "Squat",
                    sets: 4,
                    reps: "5",
                    weight_kg: 0,
                  },
                ],
              notes: "",
            }}
            templateOptions={workoutTemplates}
            onSubmit={async (values) => {
              await saveGymSession.mutateAsync(values);
            }}
          />
        </SectionCard>

        <SectionCard
          title="Body goal settings"
          description="Set the current baseline and target mass so the app can nudge the right direction."
        >
          <BodyGoalForm
            defaultValues={{
              current_weight_kg: training.profile?.current_weight_kg ?? 70,
              target_weight_kg: training.profile?.target_weight_kg ?? 76,
              height_cm: training.profile?.height_cm ?? 183,
            }}
            onSubmit={async (values) => {
              await updateProfile.mutateAsync(values);
            }}
          />

          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 text-sm text-amber-100/80">
            {countdownDays > 0
              ? "Before April 16, keep climbing capped at 3 sessions per week so study quality stays high."
              : "Post-April 16, it is safe to re-open the week to 4 climbing sessions if recovery stays clean."}
          </div>

          <div className="space-y-3">
            {overloadFlags.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-muted-foreground">
                No overload warnings yet. Keep pushing the log.
              </div>
            ) : (
              overloadFlags.map((flag) => (
                <div
                  key={flag.name}
                  className="rounded-2xl border border-amber-500/15 bg-amber-500/5 px-4 py-3"
                >
                  <p className="font-medium text-white">{flag.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No load increase recorded across the last{" "}
                    {flag.sessionsWithoutProgress} appearances.
                  </p>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <SectionCard
          title="Workout templates"
          description="Seeded Full Body A/B routines that stay editable."
        >
          <div className="space-y-3">
            {training.workoutTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-3xl border border-white/6 bg-white/[0.02] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-medium text-white">{template.name}</h3>
                    {template.notes ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {template.notes}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTemplate(template);
                      setTemplateDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
                <div className="mt-4 grid gap-2">
                  {template.exercises.map((exercise) => (
                    <div
                      key={`${template.id}-${exercise.name}`}
                      className="flex items-center justify-between rounded-2xl border border-white/6 px-3 py-2 text-sm"
                    >
                      <span className="text-white">{exercise.name}</span>
                      <span className="font-mono text-muted-foreground">
                        {exercise.sets} × {exercise.reps} @ {exercise.weight_kg}kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Weekly training schedule"
          description="Seven-day grid for the current default training week."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setEditingSchedule(null);
                setScheduleDialogOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Add slot
            </Button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {weeklySchedule.map((day) => (
              <div
                key={day.weekday}
                className="rounded-3xl border border-white/6 bg-white/[0.02] p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {formatDateLabel(
                      new Date(2026, 2, 22 + day.weekday),
                      "EEEE"
                    )}
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  {day.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No template item.</p>
                  ) : (
                    day.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/6 px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            {item.details ? (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.details}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingSchedule(item);
                                setScheduleDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            {!item.id.startsWith("fallback-") ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSchedule.mutate(item.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-3xl border border-white/10 bg-popover">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit workout template" : "Add workout template"}
            </DialogTitle>
          </DialogHeader>
          <WorkoutTemplateForm
            defaultValues={{
              name: editingTemplate?.name ?? "Full Body A",
              notes: editingTemplate?.notes ?? "",
              exercises:
                editingTemplate?.exercises ?? [
                  { name: "Squat", sets: 4, reps: "5", weight_kg: 0 },
                ],
            }}
            onSubmit={async (values) => {
              await saveWorkoutTemplate.mutateAsync({
                id: editingTemplate?.id,
                name: values.name,
                notes: values.notes ?? null,
                exercises: values.exercises,
                position:
                  editingTemplate?.position ??
                  Math.max(training.workoutTemplates.length + 1, 1),
              });
              setTemplateDialogOpen(false);
              setEditingTemplate(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-xl border border-white/10 bg-popover">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Edit training slot" : "Add training slot"}
            </DialogTitle>
          </DialogHeader>
          <ScheduleItemForm
            defaultValues={{
              schedule_type: "training",
              weekday: editingSchedule?.weekday ?? 1,
              title: editingSchedule?.title ?? "Climbing",
              details: editingSchedule?.details ?? "Technique session",
              time_label: editingSchedule?.time_label ?? "",
              category: editingSchedule?.category ?? "training",
              position:
                editingSchedule?.position ??
                Math.max(training.schedule.length + 1, 1),
            }}
            onSubmit={async (values) => {
              await saveSchedule.mutateAsync({
                id: editingSchedule?.id,
                ...values,
              });
              setScheduleDialogOpen(false);
              setEditingSchedule(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
