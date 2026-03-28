"use client";

import { SectionCard } from "@/components/cards/section-card";
import { PageHeader } from "@/components/layout/page-header";
import { RealtimeQuerySync } from "@/components/providers/realtime-query-sync";
import { useReviewData } from "@/lib/queries";
import { formatDateLabel } from "@/lib/utils";
import type { ReviewPageData } from "@/types";

interface ReviewClientProps {
  userId: string;
  initialData: ReviewPageData;
}

export function ReviewClient({ userId, initialData }: ReviewClientProps) {
  const { data } = useReviewData(userId, initialData);
  const review = data ?? initialData;

  return (
    <div className="space-y-8">
      <RealtimeQuerySync
        userId={userId}
        tables={["weekly_reviews"]}
        queryKeys={[["review", userId], ["habits", userId]]}
      />

      <PageHeader
        eyebrow="Review"
        title="A clean weekly journal of what worked and what did not."
        description="Most recent first, written to feel like a performance notebook rather than a spreadsheet."
      />

      <SectionCard
        title="Weekly reviews"
        description="Most recent first."
      >
        <div className="space-y-4">
          {review.reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-muted-foreground">
              No weekly reviews yet.
            </p>
          ) : (
            review.reviews.map((reviewEntry) => (
              <article
                key={reviewEntry.id}
                className="rounded-3xl border border-white/6 bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Week of {formatDateLabel(reviewEntry.week_start, "d MMM yyyy")}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      Rating {reviewEntry.rating ?? "-"} / 5
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-3">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-indigo-200/80">
                      Went well
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {reviewEntry.went_well}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-200/80">
                      Slipped
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {reviewEntry.slipped}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-emerald-200/80">
                      Next week
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {reviewEntry.plan_next_week}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}
