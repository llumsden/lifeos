"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { studyPromptSchema, type StudyPromptValues } from "@/lib/validators";

interface StudyAIPromptFormProps {
  defaultValues: StudyPromptValues;
  onSubmit: (values: StudyPromptValues) => Promise<void> | void;
  submitLabel?: string;
}

type StudyPromptInput = z.input<typeof studyPromptSchema>;

export function StudyAIPromptForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save prompt",
}: StudyAIPromptFormProps) {
  const form = useForm<StudyPromptInput, unknown, StudyPromptValues>({
    resolver: zodResolver(studyPromptSchema),
    defaultValues: defaultValues as StudyPromptInput,
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
        <Label htmlFor="study-prompt-label">Button label</Label>
        <Input id="study-prompt-label" {...form.register("label")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="study-prompt-position">Order</Label>
        <Input
          id="study-prompt-position"
          type="number"
          min={1}
          {...form.register("position")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="study-prompt-copy">Prompt text</Label>
        <Textarea id="study-prompt-copy" rows={8} {...form.register("prompt")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
