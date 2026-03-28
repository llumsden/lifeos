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
import { CLIMBING_SESSION_TYPES } from "@/lib/constants";
import {
  climbingSessionSchema,
  type ClimbingSessionValues,
} from "@/lib/validators";

interface ClimbingSessionFormProps {
  defaultValues: ClimbingSessionValues;
  onSubmit: (values: ClimbingSessionValues) => Promise<void> | void;
}

type ClimbingSessionInput = z.input<typeof climbingSessionSchema>;

export function ClimbingSessionForm({
  defaultValues,
  onSubmit,
}: ClimbingSessionFormProps) {
  const form = useForm<ClimbingSessionInput, unknown, ClimbingSessionValues>({
    resolver: zodResolver(climbingSessionSchema),
    defaultValues: defaultValues as ClimbingSessionInput,
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
          <Label htmlFor="climb-date">Date</Label>
          <Input id="climb-date" type="date" {...form.register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="session-type">Session type</Label>
          <NativeSelect id="session-type" {...form.register("session_type")}>
            {CLIMBING_SESSION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="grade_achieved">Grade achieved</Label>
          <Input id="grade_achieved" placeholder="V5 / 6C+" {...form.register("grade_achieved")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="volume">Attempts</Label>
          <Input id="volume" type="number" min={0} {...form.register("volume")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="energy_level">Energy (1-5)</Label>
          <Input
            id="energy_level"
            type="number"
            min={1}
            max={5}
            {...form.register("energy_level")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="climb-notes">Notes</Label>
        <Textarea id="climb-notes" rows={4} {...form.register("notes")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Log climbing session"}
      </Button>
    </form>
  );
}
