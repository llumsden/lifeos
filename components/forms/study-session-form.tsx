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
import {
  studySessionSchema,
  type StudySessionValues,
} from "@/lib/validators";

interface StudySessionFormProps {
  defaultValues: StudySessionValues;
  topicOptions: string[];
  onSubmit: (values: StudySessionValues) => Promise<void> | void;
}

type StudySessionInput = z.input<typeof studySessionSchema>;

export function StudySessionForm({
  defaultValues,
  topicOptions,
  onSubmit,
}: StudySessionFormProps) {
  const form = useForm<StudySessionInput, unknown, StudySessionValues>({
    resolver: zodResolver(studySessionSchema),
    defaultValues: defaultValues as StudySessionInput,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="study-date">Date</Label>
          <Input id="study-date" type="date" {...form.register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="study-topic">Topic</Label>
          <NativeSelect id="study-topic" {...form.register("topic")}>
            {topicOptions.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration_minutes">Minutes</Label>
          <Input
            id="duration_minutes"
            type="number"
            min={5}
            {...form.register("duration_minutes")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confidence">Confidence (1-5)</Label>
          <Input
            id="confidence"
            type="number"
            min={1}
            max={5}
            {...form.register("confidence")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="study-notes">Notes</Label>
        <Textarea id="study-notes" rows={4} {...form.register("notes")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Log session"}
      </Button>
    </form>
  );
}
