"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  tutoringSessionSchema,
  type TutoringSessionValues,
} from "@/lib/validators";

interface TutoringSessionFormProps {
  defaultValues: TutoringSessionValues;
  onSubmit: (values: TutoringSessionValues) => Promise<void> | void;
}

type TutoringSessionInput = z.input<typeof tutoringSessionSchema>;

export function TutoringSessionForm({
  defaultValues,
  onSubmit,
}: TutoringSessionFormProps) {
  const form = useForm<TutoringSessionInput, unknown, TutoringSessionValues>({
    resolver: zodResolver(tutoringSessionSchema),
    defaultValues: defaultValues as TutoringSessionInput,
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
          <Label htmlFor="client_name">Client</Label>
          <Input id="client_name" {...form.register("client_name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tutoring-date">Date</Label>
          <Input id="tutoring-date" type="date" {...form.register("date")} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="duration_minutes">Duration minutes</Label>
          <Input
            id="duration_minutes"
            type="number"
            min={15}
            {...form.register("duration_minutes")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rate_per_hour">Rate per hour</Label>
          <Input
            id="rate_per_hour"
            type="number"
            min={0}
            step="0.01"
            {...form.register("rate_per_hour")}
          />
        </div>
        <label className="flex items-end gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3">
          <input type="checkbox" {...form.register("paid")} />
          <div>
            <p className="font-medium text-white">Paid</p>
            <p className="text-sm text-muted-foreground">
              Toggle this once the money lands.
            </p>
          </div>
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tutoring-notes">Notes</Label>
        <Textarea id="tutoring-notes" rows={3} {...form.register("notes")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save tutoring session"}
      </Button>
    </form>
  );
}
