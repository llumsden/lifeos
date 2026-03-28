"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { STUDY_TOPIC_STATUSES } from "@/lib/constants";
import { topicUpdateSchema, type TopicUpdateValues } from "@/lib/validators";

interface TopicEditorFormProps {
  defaultValues: TopicUpdateValues;
  onSubmit: (values: TopicUpdateValues) => Promise<void> | void;
}

export function TopicEditorForm({
  defaultValues,
  onSubmit,
}: TopicEditorFormProps) {
  const form = useForm<TopicUpdateValues>({
    resolver: zodResolver(topicUpdateSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form
      className="space-y-3"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <NativeSelect {...form.register("status")}>
        {STUDY_TOPIC_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")}
          </option>
        ))}
      </NativeSelect>
      <Textarea rows={4} placeholder="Notes, misses, reminders..." {...form.register("notes")} />
      <Button type="submit" variant="outline" className="w-full border-white/10">
        Save topic update
      </Button>
    </form>
  );
}
