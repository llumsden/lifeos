"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { studyTaskSchema, type StudyTaskValues } from "@/lib/validators";

interface StudyTaskFormProps {
  defaultValues: StudyTaskValues;
  subjectOptions: Array<{ id: string; name: string }>;
  onSubmit: (values: StudyTaskValues) => Promise<void> | void;
  submitLabel?: string;
}

type StudyTaskInput = z.input<typeof studyTaskSchema>;

export function StudyTaskForm({
  defaultValues,
  subjectOptions,
  onSubmit,
  submitLabel = "Save task",
}: StudyTaskFormProps) {
  const form = useForm<StudyTaskInput, unknown, StudyTaskValues>({
    resolver: zodResolver(studyTaskSchema),
    defaultValues: defaultValues as StudyTaskInput,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="study-task-subject">Subject</Label>
        <NativeSelect id="study-task-subject" {...form.register("subject_id")}>
          {subjectOptions.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="study-task-title">Task</Label>
        <Input id="study-task-title" {...form.register("title")} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="study-task-date">Scheduled for</Label>
          <Input id="study-task-date" type="date" {...form.register("scheduled_for")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="study-task-time">Time label</Label>
          <Input id="study-task-time" placeholder="14:30" {...form.register("time_label")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="study-task-position">Order</Label>
        <Input
          id="study-task-position"
          type="number"
          min={1}
          {...form.register("position")}
        />
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-white/8 px-3 py-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          className="size-4 rounded border border-input"
          {...form.register("completed")}
        />
        Mark this task as completed
      </label>

      <div className="space-y-2">
        <Label htmlFor="study-task-details">Details</Label>
        <Textarea id="study-task-details" rows={4} {...form.register("details")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
