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
import { UNI_PRIORITIES, UNI_STATUSES } from "@/lib/constants";
import { uniSubjectSchema, type UniSubjectValues } from "@/lib/validators";

interface UniSubjectFormProps {
  defaultValues: UniSubjectValues;
  onSubmit: (values: UniSubjectValues) => Promise<void> | void;
  submitLabel?: string;
}

type UniSubjectInput = z.input<typeof uniSubjectSchema>;

export function UniSubjectForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save subject",
}: UniSubjectFormProps) {
  const form = useForm<UniSubjectInput, unknown, UniSubjectValues>({
    resolver: zodResolver(uniSubjectSchema),
    defaultValues: defaultValues as UniSubjectInput,
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
        <Label htmlFor="subject-name">Subject</Label>
        <Input id="subject-name" {...form.register("name")} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject-status">Status</Label>
          <NativeSelect id="subject-status" {...form.register("status")}>
            {UNI_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject-priority">Priority</Label>
          <NativeSelect id="subject-priority" {...form.register("priority")}>
            {UNI_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="last-reviewed">Last reviewed</Label>
        <Input id="last-reviewed" type="date" {...form.register("last_reviewed")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject-notes">Notes</Label>
        <Textarea id="subject-notes" rows={4} {...form.register("notes")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
