"use client";

import { CheckCircle2, Copy, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";
import { StudyMinutesChart } from "@/components/charts/study-minutes-chart";
import { StudyAIPromptForm } from "@/components/forms/study-ai-prompt-form";
import { StudySessionForm } from "@/components/forms/study-session-form";
import { StudyTaskForm } from "@/components/forms/study-task-form";
import { TopicEditorForm } from "@/components/forms/topic-editor-form";
import { UniSubjectForm } from "@/components/forms/uni-subject-form";
import { PageHeader } from "@/components/layout/page-header";
import { RealtimeQuerySync } from "@/components/providers/realtime-query-sync";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  queryKeys,
  useDeleteStudyPrompt,
  useDeleteStudyTask,
  useSaveStudyPrompt,
  useSaveStudySession,
  useSaveStudyTask,
  useSaveUniSubject,
  useStudyData,
  useToggleStudyTask,
  useUpdateJaneStreetTopic,
} from "@/lib/queries";
import {
  calculateCountdownDays,
  formatDateLabel,
  getStudyProgress,
} from "@/lib/utils";
import type {
  StudyAIPromptRow,
  StudyPageData,
  StudyTaskRow,
  UniSubjectRow,
} from "@/types";

interface StudyClientProps {
  userId: string;
  initialData: StudyPageData;
}

export function StudyClient({ userId, initialData }: StudyClientProps) {
  const { data } = useStudyData(userId, initialData);
  const study = data ?? initialData;
  const saveSession = useSaveStudySession(userId);
  const updateTopic = useUpdateJaneStreetTopic(userId);
  const saveSubject = useSaveUniSubject(userId);
  const saveTask = useSaveStudyTask(userId);
  const toggleTask = useToggleStudyTask(userId);
  const deleteTask = useDeleteStudyTask(userId);
  const savePrompt = useSaveStudyPrompt(userId);
  const deletePrompt = useDeleteStudyPrompt(userId);

  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<UniSubjectRow | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTaskRow | null>(null);
  const [taskSubjectId, setTaskSubjectId] = useState<string>("");
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<StudyAIPromptRow | null>(null);

  const progress = getStudyProgress(study.topics);
  const countdownDays = calculateCountdownDays();

  const groupedTopics = useMemo(() => {
    return study.topics.reduce<Record<number, typeof study.topics>>((acc, topic) => {
      acc[topic.week] = [...(acc[topic.week] ?? []), topic];
      return acc;
    }, {});
  }, [study]);

  const kanbanColumns = useMemo(
    () => [
      {
        label: "Behind",
        key: "behind",
        items: study.subjects.filter((subject) => subject.status === "behind"),
      },
      {
        label: "Catching up",
        key: "catching_up",
        items: study.subjects.filter((subject) => subject.status === "catching_up"),
      },
      {
        label: "On track",
        key: "on_track",
        items: study.subjects.filter((subject) => subject.status === "on_track"),
      },
    ],
    [study.subjects]
  );

  const tasksBySubject = useMemo(() => {
    return study.tasks.reduce<Record<string, StudyTaskRow[]>>((acc, task) => {
      acc[task.subject_id] = [...(acc[task.subject_id] ?? []), task];
      return acc;
    }, {});
  }, [study.tasks]);

  const scheduledTasksCount = study.tasks.filter((task) => Boolean(task.scheduled_for)).length;
  const promptEditorTitle = editingPrompt
    ? "Edit study prompt"
    : "Add study prompt";

  return (
    <div className="space-y-8">
      <RealtimeQuerySync
        userId={userId}
        tables={[
          "jane_street_topics",
          "study_sessions",
          "uni_subjects",
          "study_tasks",
          "study_ai_prompts",
        ]}
        queryKeys={[queryKeys.study(userId), queryKeys.dashboard(userId)]}
      />

      <PageHeader
        eyebrow="Study"
        title="Prep the interview, then clean up uni."
        description="Jane Street prep stays focused and measurable while the uni backlog, task lists, and AI prompt library stay in one calm workflow."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setEditingSubject(null);
              setSubjectDialogOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Add subject
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Interview countdown"
          value={`${countdownDays} days`}
          caption="Dynamic calendar diff to April 16, 2026."
          accent="primary"
        />
        <StatCard
          label="Topic progress"
          value={`${progress}%`}
          caption={`${study.topics.filter((topic) => topic.status === "done").length} of ${study.topics.length} topics marked done.`}
          accent="success"
        />
        <StatCard
          label="Active subject tasks"
          value={`${study.tasks.filter((task) => !task.completed).length}`}
          caption="Open task count across all uni subjects."
          accent="warning"
        />
        <StatCard
          label="Scheduled on dashboard"
          value={`${scheduledTasksCount}`}
          caption="Study tasks with a date that can surface in the dashboard timetable."
          accent="neutral"
        />
      </div>

      <SectionCard
        title="AI prompt shelf"
        description="Keep reusable prompts as one-click copy buttons for worked examples, summaries, or practice sets."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setEditingPrompt(null);
              setPromptDialogOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Add prompt
          </Button>
        }
      >
        {promptDialogOpen ? (
          <div className="rounded-3xl border border-white/8 bg-black/20 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-indigo-200/80">
                  Prompt editor
                </p>
                <h3 className="mt-2 text-base font-medium text-white">
                  {promptEditorTitle}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPromptDialogOpen(false);
                  setEditingPrompt(null);
                }}
              >
                Cancel
              </Button>
            </div>

            <StudyAIPromptForm
              defaultValues={{
                label: editingPrompt?.label ?? "",
                prompt: editingPrompt?.prompt ?? "",
                position:
                  editingPrompt?.position ?? Math.max(study.prompts.length + 1, 1),
              }}
              onSubmit={async (values) => {
                await savePrompt.mutateAsync({
                  id: editingPrompt?.id,
                  ...values,
                });
                setPromptDialogOpen(false);
                setEditingPrompt(null);
              }}
            />
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {study.prompts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              No prompt buttons yet. Add the ones you want to reuse the most.
            </div>
          ) : (
            study.prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-3xl border border-white/6 bg-white/[0.02] p-4"
              >
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-indigo-200/80">
                  Prompt button
                </p>
                <h3 className="mt-2 text-base font-medium text-white">{prompt.label}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {prompt.prompt.length > 180
                    ? `${prompt.prompt.slice(0, 180)}...`
                    : prompt.prompt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (!navigator.clipboard) {
                        toast.error("Clipboard access is not available here.");
                        return;
                      }

                      await navigator.clipboard.writeText(prompt.prompt);
                      toast.success(`Copied "${prompt.label}"`);
                    }}
                  >
                    <Copy className="mr-2 size-4" />
                    Copy prompt
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingPrompt(prompt);
                      setPromptDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePrompt.mutate(prompt.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Jane Street prep tracker"
        description="Three weeks of focused topics, each with a status and notes loop."
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Overall completion</p>
            <p className="mono-numeric text-sm text-white">{progress}%</p>
          </div>
          <Progress value={progress} className="h-3 bg-white/5" />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {Object.entries(groupedTopics).map(([week, topics]) => (
            <div key={week} className="space-y-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-indigo-200/80">
                  Week {week}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">Focus stack</h3>
              </div>

              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-3xl border border-white/6 bg-white/[0.02] p-4"
                >
                  <div className="mb-4">
                    <h4 className="text-base font-medium text-white">{topic.title}</h4>
                    {topic.description ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {topic.description}
                      </p>
                    ) : null}
                  </div>

                  <TopicEditorForm
                    defaultValues={{
                      status: topic.status,
                      notes: topic.notes ?? "",
                    }}
                    onSubmit={async (values) => {
                      await updateTopic.mutateAsync({
                        id: topic.id,
                        ...values,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <SectionCard
          title="Session log"
          description="Log every prep block with topic, duration, confidence, and notes."
        >
          <StudySessionForm
            defaultValues={{
              date: study.today,
              topic: study.topics[0]?.title ?? "Probability fundamentals",
              duration_minutes: 60,
              confidence: 3,
              notes: "",
            }}
            topicOptions={study.topics.map((topic) => topic.title)}
            onSubmit={async (values) => {
              await saveSession.mutateAsync(values);
            }}
          />
        </SectionCard>

        <SectionCard
          title="Past 2 weeks"
          description="Daily study minutes over the last 14 days."
        >
          <StudyMinutesChart sessions={study.sessions} />
        </SectionCard>
      </div>

      <SectionCard
        title="Recent session entries"
        description="A compact log to spot confidence and consistency trends quickly."
      >
        <div className="space-y-3">
          {study.sessions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-muted-foreground">
              No sessions logged yet.
            </p>
          ) : (
            study.sessions.slice(0, 8).map((session) => (
              <div
                key={session.id}
                className="grid gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4 md:grid-cols-[120px,1fr,90px,100px]"
              >
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {formatDateLabel(session.date, "d MMM")}
                </p>
                <div>
                  <p className="font-medium text-white">{session.topic}</p>
                  {session.notes ? (
                    <p className="mt-1 text-sm text-muted-foreground">{session.notes}</p>
                  ) : null}
                </div>
                <p className="mono-numeric text-sm text-white">
                  {session.duration_minutes} min
                </p>
                <p className="mono-numeric text-sm text-white">
                  {session.confidence}/5
                </p>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Uni catch-up tracker"
        description="Each subject now carries its own editable task list and schedule metadata for the dashboard timetable."
      >
        <div className="grid gap-6 xl:grid-cols-3">
          {kanbanColumns.map((column) => (
            <div key={column.key} className="space-y-3">
              <div className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {column.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {column.items.length}
                </p>
              </div>

              {column.items.map((subject) => (
                <div
                  key={subject.id}
                  className="rounded-3xl border border-white/6 bg-white/[0.02] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-medium text-white">{subject.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Priority: {subject.priority}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingSubject(subject);
                        setSubjectDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>

                  {subject.notes ? (
                    <p className="mt-3 text-sm text-muted-foreground">{subject.notes}</p>
                  ) : null}

                  {subject.last_reviewed ? (
                    <p className="mt-3 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Last reviewed {formatDateLabel(subject.last_reviewed, "d MMM")}
                    </p>
                  ) : null}

                  <div className="mt-4 space-y-2 rounded-2xl border border-white/6 bg-black/20 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                        Task list
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTask(null);
                          setTaskSubjectId(subject.id);
                          setTaskDialogOpen(true);
                        }}
                      >
                        <Plus className="mr-2 size-4" />
                        Add task
                      </Button>
                    </div>

                    {(tasksBySubject[subject.id] ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No tasks yet for this subject.
                      </p>
                    ) : (
                      (tasksBySubject[subject.id] ?? []).map((task) => (
                        <div
                          key={task.id}
                          className="rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              className="flex flex-1 items-start gap-3 text-left"
                              onClick={() =>
                                toggleTask.mutate({
                                  id: task.id,
                                  completed: !task.completed,
                                })
                              }
                            >
                              <CheckCircle2
                                className={`mt-0.5 size-4 ${
                                  task.completed
                                    ? "text-emerald-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                              <div>
                                <p
                                  className={`text-sm ${
                                    task.completed
                                      ? "text-muted-foreground line-through"
                                      : "text-white"
                                  }`}
                                >
                                  {task.title}
                                </p>
                                {(task.scheduled_for || task.time_label) ? (
                                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-indigo-200/80">
                                    {[task.scheduled_for, task.time_label]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </p>
                                ) : null}
                                {task.details ? (
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {task.details}
                                  </p>
                                ) : null}
                              </div>
                            </button>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTask(task);
                                  setTaskSubjectId(subject.id);
                                  setTaskDialogOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTask.mutate(task.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
        <DialogContent className="max-w-xl border border-white/10 bg-popover">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Edit subject" : "Add subject"}
            </DialogTitle>
          </DialogHeader>
          <UniSubjectForm
            defaultValues={{
              name: editingSubject?.name ?? "",
              status: editingSubject?.status ?? "behind",
              priority: editingSubject?.priority ?? "medium",
              notes: editingSubject?.notes ?? "",
              last_reviewed: editingSubject?.last_reviewed ?? study.today,
            }}
            onSubmit={async (values) => {
              await saveSubject.mutateAsync({
                id: editingSubject?.id,
                ...values,
              });
              setSubjectDialogOpen(false);
              setEditingSubject(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-xl border border-white/10 bg-popover">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit subject task" : "Add subject task"}
            </DialogTitle>
          </DialogHeader>
          <StudyTaskForm
            defaultValues={{
              subject_id:
                editingTask?.subject_id ?? taskSubjectId ?? study.subjects[0]?.id ?? "",
              title: editingTask?.title ?? "",
              details: editingTask?.details ?? "",
              completed: editingTask?.completed ?? false,
              scheduled_for: editingTask?.scheduled_for ?? study.today,
              time_label: editingTask?.time_label ?? "",
              position: editingTask?.position ?? Math.max(study.tasks.length + 1, 1),
            }}
            subjectOptions={study.subjects.map((subject) => ({
              id: subject.id,
              name: subject.name,
            }))}
            onSubmit={async (values) => {
              await saveTask.mutateAsync({
                id: editingTask?.id,
                ...values,
              });
              setTaskDialogOpen(false);
              setEditingTask(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
