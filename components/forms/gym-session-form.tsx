"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { GYM_SESSION_TYPES } from "@/lib/constants";
import { gymSessionSchema, type GymSessionValues } from "@/lib/validators";
import type { GymExercise } from "@/types";

interface GymSessionFormProps {
  defaultValues: GymSessionValues;
  templateOptions: Array<{
    label: string;
    sessionType: "A" | "B";
    exercises: GymExercise[];
  }>;
  onSubmit: (values: GymSessionValues) => Promise<void> | void;
}

const emptyExercise: GymExercise = {
  name: "",
  sets: 3,
  reps: "8",
  weight_kg: 0,
};

type GymSessionInput = z.input<typeof gymSessionSchema>;

export function GymSessionForm({
  defaultValues,
  templateOptions,
  onSubmit,
}: GymSessionFormProps) {
  const form = useForm<GymSessionInput, unknown, GymSessionValues>({
    resolver: zodResolver(gymSessionSchema),
    defaultValues: defaultValues as GymSessionInput,
  });

  const { fields, append, remove, replace } = useFieldArray({
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gym-date">Date</Label>
          <Input id="gym-date" type="date" {...form.register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gym-session-type">Session type</Label>
          <NativeSelect
            id="gym-session-type"
            {...form.register("session_type")}
          >
            {GYM_SESSION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === "A" ? "Full Body A" : "Full Body B"}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {templateOptions.map((template) => (
          <Button
            key={template.label}
            type="button"
            variant="outline"
            className="border-white/10 bg-white/[0.02]"
            onClick={() => {
              form.setValue("session_type", template.sessionType);
              replace(template.exercises);
            }}
          >
            Load {template.label}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          onClick={() => append(emptyExercise)}
        >
          <Plus className="mr-2 size-4" />
          Add exercise
        </Button>
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

            <div className="grid gap-4 md:grid-cols-4">
              <Input placeholder="Exercise" {...form.register(`exercises.${index}.name`)} />
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

      <div className="space-y-2">
        <Label htmlFor="gym-notes">Notes</Label>
        <Textarea id="gym-notes" rows={4} {...form.register("notes")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Log gym session"}
      </Button>
    </form>
  );
}
