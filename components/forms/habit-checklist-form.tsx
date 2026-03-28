"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CORE_HABITS } from "@/lib/constants";
import {
  habitChecklistSchema,
  type HabitChecklistValues,
} from "@/lib/validators";

interface HabitChecklistFormProps {
  defaultValues: HabitChecklistValues;
  onSubmit: (values: HabitChecklistValues) => Promise<void> | void;
  submitLabel?: string;
}

export function HabitChecklistForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save today's habits",
}: HabitChecklistFormProps) {
  const form = useForm<HabitChecklistValues>({
    resolver: zodResolver(habitChecklistSchema),
    defaultValues,
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
      <input type="hidden" {...form.register("date")} />

      <div className="grid gap-3">
        {CORE_HABITS.map((habit) => (
          <label
            key={habit.key}
            className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3"
          >
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500"
              {...form.register(habit.key)}
            />
            <div>
              <p className="font-medium text-white">{habit.label}</p>
              <p className="text-sm text-muted-foreground">{habit.description}</p>
            </div>
          </label>
        ))}
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
