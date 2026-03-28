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
  scheduleTemplateSchema,
  type ScheduleTemplateValues,
} from "@/lib/validators";

const weekdayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

interface ScheduleItemFormProps {
  defaultValues: ScheduleTemplateValues;
  onSubmit: (values: ScheduleTemplateValues) => Promise<void> | void;
  submitLabel?: string;
}

type ScheduleItemInput = z.input<typeof scheduleTemplateSchema>;

export function ScheduleItemForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save schedule item",
}: ScheduleItemFormProps) {
  const form = useForm<ScheduleItemInput, unknown, ScheduleTemplateValues>({
    resolver: zodResolver(scheduleTemplateSchema),
    defaultValues: defaultValues as ScheduleItemInput,
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="weekday">Day</Label>
          <NativeSelect id="weekday" {...form.register("weekday")}>
            {weekdayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time_label">Time label</Label>
          <Input id="time_label" placeholder="08:00" {...form.register("time_label")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Details</Label>
        <Textarea id="details" rows={4} {...form.register("details")} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="study" {...form.register("category")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" type="number" min={1} {...form.register("position")} />
        </div>
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
