"use client";

import { useMemo, useState } from "react";

import { WeeklyReviewForm } from "@/components/forms/weekly-review-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePendingWeeklyReview, useSaveWeeklyReview } from "@/lib/queries";
import { startOfWeekISO } from "@/lib/utils";
import type { WeeklyReviewValues } from "@/lib/validators";

interface SundayReviewPromptProps {
  userId: string;
}

export function SundayReviewPrompt({ userId }: SundayReviewPromptProps) {
  const { data: pending } = usePendingWeeklyReview(userId);
  const saveReview = useSaveWeeklyReview(userId);
  const [dismissed, setDismissed] = useState(false);

  const defaultValues = useMemo<WeeklyReviewValues>(
    () => ({
      week_start: pending?.week_start ?? startOfWeekISO(),
      went_well: "",
      slipped: "",
      plan_next_week: "",
      rating: 4,
    }),
    [pending?.week_start]
  );

  const isOpen = Boolean(pending) && !dismissed;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setDismissed(!open)}>
      <DialogContent className="max-w-2xl border border-white/10 bg-popover">
        <DialogHeader>
          <DialogTitle>Weekly review</DialogTitle>
          <DialogDescription>
            What went well? What slipped? What is the plan for next week?
          </DialogDescription>
        </DialogHeader>

        <WeeklyReviewForm
          defaultValues={defaultValues}
          onSubmit={async (values) => {
            await saveReview.mutateAsync(values);
            setDismissed(true);
          }}
          submitLabel="Save Sunday review"
        />
      </DialogContent>
    </Dialog>
  );
}
