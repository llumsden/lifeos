"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";
import { StudyMinutesChart } from "@/components/charts/study-minutes-chart";
import { StudySessionForm } from "@/components/forms/study-session-form";
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
  useSaveStudySession,
  useSaveUniSubject,
  useStudyData,
  useUpdateJaneStreetTopic,
} from "@/lib/queries";
import { calculateCountdownDays, getStudyProgress, formatDateLabel } from "@/lib/utils";
import type { StudyPageData, UniSubjectRow } from "@/types";

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
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<UniSubjectRow | null>(null);

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

  return (
    <div className="space-y-8">
      <RealtimeQuerySync
        userId={userId}
        tables={["jane_street_topics", "study_sessions", "uni_subjects"]}
        queryKeys={[queryKeys.study(userId)]}
      />

      <PageHeader
        eyebrow="Study"
        title="Prep the interview, then clean up uni."
        description="Jane Street prep stays focused and measurable while the uni backlog gets pushed through a calm kanban flow."
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

      <div className="grid gap-4 md:grid-cols-3">
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
          label="Recent study sessions"
          value={`${study.sessions.length}`}
          caption="Tracked sessions across the recent sprint window."
          accent="warning"
        />
      </div>

      <SectionCard
        title="Jane Street prep tracker"
        description="Three weeks of focused topics, each with a status and notes loop."
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Overall completion
            </p>
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
                <h3 className="mt-2 text-lg font-semibold text-white">
                  Focus stack
                </h3>
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
        description="Kanban-style columns for your subjects, with inline editing via cards."
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
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
        <DialogContent className="max-w-xl border border-white/10 bg-[#121212]">
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
    </div>
  );
}
