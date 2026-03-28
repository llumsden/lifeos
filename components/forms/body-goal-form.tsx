"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const bodyGoalSchema = z.object({
  current_weight_kg: z.coerce.number().min(0),
  target_weight_kg: z.coerce.number().min(0),
  height_cm: z.coerce.number().min(0),
});

export type BodyGoalValues = z.infer<typeof bodyGoalSchema>;
type BodyGoalInput = z.input<typeof bodyGoalSchema>;

interface BodyGoalFormProps {
  defaultValues: BodyGoalValues;
  onSubmit: (values: BodyGoalValues) => Promise<void> | void;
}

export function BodyGoalForm({
  defaultValues,
  onSubmit,
}: BodyGoalFormProps) {
  const form = useForm<BodyGoalInput, unknown, BodyGoalValues>({
    resolver: zodResolver(bodyGoalSchema),
    defaultValues: defaultValues as BodyGoalInput,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form
      className="grid gap-4 md:grid-cols-3"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="current_weight_kg">Current weight</Label>
        <Input
          id="current_weight_kg"
          type="number"
          min={0}
          step="0.1"
          {...form.register("current_weight_kg")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_weight_kg">Target weight</Label>
        <Input
          id="target_weight_kg"
          type="number"
          min={0}
          step="0.1"
          {...form.register("target_weight_kg")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="height_cm">Height (cm)</Label>
        <Input
          id="height_cm"
          type="number"
          min={0}
          {...form.register("height_cm")}
        />
      </div>

      <div className="md:col-span-3">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save body goals"}
        </Button>
      </div>
    </form>
  );
}
