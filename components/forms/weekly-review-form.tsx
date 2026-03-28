"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { weeklyReviewSchema, type WeeklyReviewValues } from "@/lib/validators";

interface WeeklyReviewFormProps {
  defaultValues: WeeklyReviewValues;
  onSubmit: (values: WeeklyReviewValues) => Promise<void> | void;
  submitLabel?: string;
}

type WeeklyReviewInput = z.input<typeof weeklyReviewSchema>;

export function WeeklyReviewForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save review",
}: WeeklyReviewFormProps) {
  const form = useForm<WeeklyReviewInput, unknown, WeeklyReviewValues>({
    resolver: zodResolver(weeklyReviewSchema),
    defaultValues: defaultValues as WeeklyReviewInput,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <input type="hidden" {...register("week_start")} />

      <div className="space-y-2">
        <Label htmlFor="went_well">What went well?</Label>
        <Textarea
          id="went_well"
          rows={4}
          placeholder="Momentum, wins, routines that worked..."
          {...register("went_well")}
        />
        {errors.went_well ? (
          <p className="text-sm text-red-400">{errors.went_well.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slipped">What slipped?</Label>
        <Textarea
          id="slipped"
          rows={4}
          placeholder="Where did friction show up?"
          {...register("slipped")}
        />
        {errors.slipped ? (
          <p className="text-sm text-red-400">{errors.slipped.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan_next_week">Plan for next week</Label>
        <Textarea
          id="plan_next_week"
          rows={4}
          placeholder="What does a clean next week look like?"
          {...register("plan_next_week")}
        />
        {errors.plan_next_week ? (
          <p className="text-sm text-red-400">{errors.plan_next_week.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Overall rating (1-5)</Label>
        <Input
          id="rating"
          type="number"
          min={1}
          max={5}
          {...register("rating")}
        />
        {errors.rating ? (
          <p className="text-sm text-red-400">{errors.rating.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
