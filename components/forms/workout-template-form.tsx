"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  workoutTemplateSchema,
  type WorkoutTemplateValues,
} from "@/lib/validators";

interface WorkoutTemplateFormProps {
  defaultValues: WorkoutTemplateValues;
  onSubmit: (values: WorkoutTemplateValues) => Promise<void> | void;
  submitLabel?: string;
}

type WorkoutTemplateInput = z.input<typeof workoutTemplateSchema>;

export function WorkoutTemplateForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save workout template",
}: WorkoutTemplateFormProps) {
  const form = useForm<WorkoutTemplateInput, unknown, WorkoutTemplateValues>({
    resolver: zodResolver(workoutTemplateSchema),
    defaultValues: defaultValues as WorkoutTemplateInput,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
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
        <Label htmlFor="template-name">Template name</Label>
        <Input id="template-name" {...form.register("name")} />
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-2xl border border-white/6 bg-white/[0.02] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium text-white">Exercise {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="mr-2 size-4" />
                Remove
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <Input placeholder="Name" {...form.register(`exercises.${index}.name`)} />
              <Input type="number" min={1} placeholder="Sets" {...form.register(`exercises.${index}.sets`)} />
              <Input placeholder="Reps" {...form.register(`exercises.${index}.reps`)} />
              <Input
                type="number"
                min={0}
                step="0.5"
                placeholder="Weight"
                {...form.register(`exercises.${index}.weight_kg`)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="border-white/10"
        onClick={() =>
          append({
            name: "",
            sets: 3,
            reps: "8",
            weight_kg: 0,
          })
        }
      >
        <Plus className="mr-2 size-4" />
        Add exercise
      </Button>

      <div className="space-y-2">
        <Label htmlFor="template-notes">Notes</Label>
        <Textarea id="template-notes" rows={4} {...form.register("notes")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
