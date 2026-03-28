"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";

import { CORE_HABITS } from "@/lib/constants";
import {
  getDashboardPageData as loadDashboardPageData,
  getFinancePageData as loadFinancePageData,
  getHabitsPageData as loadHabitsPageData,
  getReviewPageData as loadReviewPageData,
  getStudyPageData as loadStudyPageData,
  getTrainingPageData as loadTrainingPageData,
} from "@/lib/server-data";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getTodayISO, startOfWeekISO } from "@/lib/utils";
import type {
  ClimbingSessionRow,
  DashboardPageData,
  ExpenseRow,
  FinancePageData,
  GymSessionRow,
  GymWorkoutTemplateRow,
  HabitKey,
  HabitsPageData,
  JaneStreetTopicRow,
  ReviewPageData,
  StudyPageData,
  StudyTaskRow,
  TrainingPageData,
  UniSubjectRow,
  UserProfileRow,
  WeeklyReviewRow,
  WeeklyScheduleTemplateRow
} from "@/types";

type Client = SupabaseClient;

export const queryKeys = {
  dashboard: (userId: string) => ["dashboard", userId] as const,
  study: (userId: string) => ["study", userId] as const,
  training: (userId: string) => ["training", userId] as const,
  finance: (userId: string) => ["finance", userId] as const,
  habits: (userId: string) => ["habits", userId] as const,
  review: (userId: string) => ["review", userId] as const,
};

async function maybeMany<T>(
  promise: PromiseLike<{ data: T[] | null; error: unknown }>
) {
  const { data, error } = await promise;
  if (error) throw error;
  return data ?? [];
}

async function fetchWeeklyReviews(client: Client, userId: string, daysBack = 365) {
  const startDate = format(addDays(new Date(), -daysBack), "yyyy-MM-dd");

  return maybeMany<WeeklyReviewRow>(
    client
      .from("weekly_reviews")
      .select("*")
      .eq("user_id", userId)
      .gte("week_start", startDate)
      .order("week_start", { ascending: false })
  );
}

export async function getDashboardPageData(client: Client, userId: string) {
  return loadDashboardPageData(client, userId);
}

export async function getStudyPageData(client: Client, userId: string) {
  return loadStudyPageData(client, userId);
}

export async function getTrainingPageData(client: Client, userId: string) {
  return loadTrainingPageData(client, userId);
}

export async function getFinancePageData(client: Client, userId: string) {
  return loadFinancePageData(client, userId);
}

export async function getHabitsPageData(client: Client, userId: string) {
  return loadHabitsPageData(client, userId);
}

export async function getReviewPageData(client: Client, userId: string) {
  return loadReviewPageData(client, userId);
}

function useUserQuery<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Partial<UseQueryOptions<TData>>
) {
  return useQuery<TData>({
    queryKey: [...queryKey],
    queryFn,
    ...options,
  });
}

export function useDashboardData(userId: string, initialData: DashboardPageData) {
  return useUserQuery(queryKeys.dashboard(userId), () => {
    const client = createSupabaseBrowserClient();
    return loadDashboardPageData(client, userId);
  }, { initialData });
}

export function useStudyData(userId: string, initialData: StudyPageData) {
  return useUserQuery(queryKeys.study(userId), () => {
    const client = createSupabaseBrowserClient();
    return loadStudyPageData(client, userId);
  }, { initialData });
}

export function useTrainingData(userId: string, initialData: TrainingPageData) {
  return useUserQuery(queryKeys.training(userId), () => {
    const client = createSupabaseBrowserClient();
    return loadTrainingPageData(client, userId);
  }, { initialData });
}

export function useFinanceData(userId: string, initialData: FinancePageData) {
  return useUserQuery(queryKeys.finance(userId), () => {
    const client = createSupabaseBrowserClient();
    return loadFinancePageData(client, userId);
  }, { initialData });
}

export function useHabitsData(userId: string, initialData: HabitsPageData) {
  return useUserQuery(queryKeys.habits(userId), () => {
    const client = createSupabaseBrowserClient();
    return loadHabitsPageData(client, userId);
  }, { initialData });
}

export function useReviewData(userId: string, initialData: ReviewPageData) {
  return useUserQuery(queryKeys.review(userId), () => {
    const client = createSupabaseBrowserClient();
    return loadReviewPageData(client, userId);
  }, { initialData });
}

function invalidateQueries(queryClient: ReturnType<typeof useQueryClient>, userId: string, scopes: Array<keyof typeof queryKeys>) {
  scopes.forEach((scope) => {
    queryClient.invalidateQueries({
      queryKey: [...queryKeys[scope](userId)],
    });
  });
}

function useAppMutation<TValues>({
  userId,
  mutationFn,
  successMessage,
  scopes,
}: {
  userId: string;
  mutationFn: (values: TValues, client: Client) => Promise<unknown>;
  successMessage: string;
  scopes: Array<keyof typeof queryKeys>;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: TValues) => {
      const client = createSupabaseBrowserClient();
      return mutationFn(values, client);
    },
    onSuccess: () => {
      invalidateQueries(queryClient, userId, scopes);
      toast.success(successMessage);
    },
    onError: (error) => {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    },
  });
}

export function useQuickLogHabits(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["dashboard", "habits"],
    successMessage: "Today's habits were quick-logged.",
    mutationFn: async (_, client) => {
      const today = getTodayISO();
      const rows = CORE_HABITS.map((habit) => ({
        user_id: userId,
        date: today,
        habit_key: habit.key,
        completed: true,
      }));

      const { error } = await client
        .from("habits_log")
        .upsert(rows, { onConflict: "user_id,date,habit_key" });

      if (error) throw error;
    },
  });
}

export function useSaveHabitChecklist(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["dashboard", "habits"],
    successMessage: "Today's habits were updated.",
    mutationFn: async (
      values: Record<HabitKey | "date", boolean | string>,
      client
    ) => {
      const date = values.date as string;
      const rows = CORE_HABITS.map((habit) => ({
        user_id: userId,
        date,
        habit_key: habit.key,
        completed: Boolean(values[habit.key]),
      }));

      const { error } = await client
        .from("habits_log")
        .upsert(rows, { onConflict: "user_id,date,habit_key" });

      if (error) throw error;
    },
  });
}

export function useSaveStudySession(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["study"],
    successMessage: "Study session saved.",
    mutationFn: async (
      values: {
        id?: string;
        date: string;
        topic: string;
        duration_minutes: number;
        confidence: number;
        notes?: string | null;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        notes: values.notes ?? null,
      };

      const { error } = values.id
        ? await client.from("study_sessions").update(payload).eq("id", values.id)
        : await client.from("study_sessions").insert(payload);

      if (error) throw error;
    },
  });
}

export function useUpdateJaneStreetTopic(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["study"],
    successMessage: "Topic updated.",
    mutationFn: async (
      values: {
        id: string;
        status: JaneStreetTopicRow["status"];
        notes?: string | null;
      },
      client
    ) => {
      const { error } = await client
        .from("jane_street_topics")
        .update({
          status: values.status,
          notes: values.notes ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id);

      if (error) throw error;
    },
  });
}

export function useSaveUniSubject(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["study"],
    successMessage: "Subject saved.",
    mutationFn: async (
      values: {
        id?: string;
        name: string;
        status: UniSubjectRow["status"];
        priority: UniSubjectRow["priority"];
        notes?: string | null;
        last_reviewed?: string | null;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        notes: values.notes ?? null,
        last_reviewed: values.last_reviewed ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error } = values.id
        ? await client.from("uni_subjects").update(payload).eq("id", values.id)
        : await client.from("uni_subjects").insert(payload);

      if (error) throw error;
    },
  });
}

export function useSaveStudyTask(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["study", "dashboard"],
    successMessage: "Study task saved.",
    mutationFn: async (
      values: {
        id?: string;
        subject_id: string;
        title: string;
        details?: string | null;
        completed: boolean;
        scheduled_for?: string | null;
        time_label?: string | null;
        position: number;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        details: values.details ?? null,
        scheduled_for: values.scheduled_for ?? null,
        time_label: values.time_label ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error } = values.id
        ? await client.from("study_tasks").update(payload).eq("id", values.id)
        : await client.from("study_tasks").insert(payload);

      if (error) throw error;
    },
  });
}

export function useToggleStudyTask(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["study", "dashboard"],
    successMessage: "Study task updated.",
    mutationFn: async (
      values: Pick<StudyTaskRow, "id" | "completed">,
      client
    ) => {
      const { error } = await client
        .from("study_tasks")
        .update({
          completed: values.completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id);

      if (error) throw error;
    },
  });
}

export function useDeleteStudyTask(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["study", "dashboard"],
    successMessage: "Study task removed.",
    mutationFn: async (id: string, client) => {
      const { error } = await client.from("study_tasks").delete().eq("id", id);

      if (error) throw error;
    },
  });
}

export function useSaveStudyPrompt(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["study"],
    successMessage: "Study prompt saved.",
    mutationFn: async (
      values: {
        id?: string;
        label: string;
        prompt: string;
        position: number;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        updated_at: new Date().toISOString(),
      };

      const { error } = values.id
        ? await client.from("study_ai_prompts").update(payload).eq("id", values.id)
        : await client.from("study_ai_prompts").insert(payload);

      if (error) throw error;
    },
  });
}

export function useDeleteStudyPrompt(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["study"],
    successMessage: "Study prompt removed.",
    mutationFn: async (id: string, client) => {
      const { error } = await client
        .from("study_ai_prompts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
  });
}

export function useSaveClimbingSession(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["training"],
    successMessage: "Climbing session logged.",
    mutationFn: async (
      values: {
        id?: string;
        date: string;
        session_type: ClimbingSessionRow["session_type"];
        grade_achieved?: string | null;
        volume?: number | null;
        energy_level?: number | null;
        notes?: string | null;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        grade_achieved: values.grade_achieved ?? null,
        volume: values.volume ?? null,
        energy_level: values.energy_level ?? null,
        notes: values.notes ?? null,
      };

      const { error } = values.id
        ? await client.from("climbing_sessions").update(payload).eq("id", values.id)
        : await client.from("climbing_sessions").insert(payload);

      if (error) throw error;
    },
  });
}

export function useSaveGymSession(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["training"],
    successMessage: "Gym session logged.",
    mutationFn: async (
      values: {
        id?: string;
        date: string;
        session_type: GymSessionRow["session_type"];
        exercises: NonNullable<GymSessionRow["exercises"]>;
        notes?: string | null;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        notes: values.notes ?? null,
      };

      const { error } = values.id
        ? await client.from("gym_sessions").update(payload).eq("id", values.id)
        : await client.from("gym_sessions").insert(payload);

      if (error) throw error;
    },
  });
}

export function useSaveWorkoutTemplate(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["training"],
    successMessage: "Workout template saved.",
    mutationFn: async (
      values: {
        id?: string;
        name: string;
        position: number;
        exercises: GymWorkoutTemplateRow["exercises"];
        notes?: string | null;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        notes: values.notes ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error } = values.id
        ? await client
            .from("gym_workout_templates")
            .update(payload)
            .eq("id", values.id)
        : await client.from("gym_workout_templates").insert(payload);

      if (error) throw error;
    },
  });
}

export function useSaveExpense(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["finance"],
    successMessage: "Expense saved.",
    mutationFn: async (
      values: {
        id?: string;
        date: string;
        amount: number;
        category: ExpenseRow["category"];
        note?: string | null;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        note: values.note ?? null,
      };

      const { error } = values.id
        ? await client.from("expenses").update(payload).eq("id", values.id)
        : await client.from("expenses").insert(payload);

      if (error) throw error;
    },
  });
}

export function useSaveIncomeEntry(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["finance"],
    successMessage: "Income saved.",
    mutationFn: async (
      values: {
        id?: string;
        date: string;
        amount: number;
        source: string;
        note?: string | null;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        note: values.note ?? null,
      };

      const { error } = values.id
        ? await client.from("income_entries").update(payload).eq("id", values.id)
        : await client.from("income_entries").insert(payload);

      if (error) throw error;
    },
  });
}

export function useSaveTutoringSession(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["finance"],
    successMessage: "Tutoring session saved.",
    mutationFn: async (
      values: {
        id?: string;
        date: string;
        client_name?: string | null;
        duration_minutes?: number | null;
        rate_per_hour?: number | null;
        paid: boolean;
        notes?: string | null;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        client_name: values.client_name ?? null,
        duration_minutes: values.duration_minutes ?? null,
        rate_per_hour: values.rate_per_hour ?? null,
        notes: values.notes ?? null,
      };

      const { error } = values.id
        ? await client
            .from("tutoring_sessions")
            .update(payload)
            .eq("id", values.id)
        : await client.from("tutoring_sessions").insert(payload);

      if (error) throw error;
    },
  });
}

export function useSaveWeeklyReview(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["habits", "review"],
    successMessage: "Weekly review saved.",
    mutationFn: async (
      values: Omit<WeeklyReviewRow, "id" | "user_id" | "created_at"> & {
        id?: string;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
      };

      const { error } = await client
        .from("weekly_reviews")
        .upsert(payload, { onConflict: "user_id,week_start" });

      if (error) throw error;
    },
  });
}

export function useUpdateProfile(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["dashboard", "training", "finance"],
    successMessage: "Profile settings updated.",
    mutationFn: async (values: Partial<UserProfileRow>, client) => {
      const { error } = await client
        .from("user_profiles")
        .upsert({
          user_id: userId,
          weekly_budget_limit: 0,
          current_weight_kg: 70,
          target_weight_kg: 76,
          height_cm: 183,
          interview_target_date: "2026-04-16",
          ...values,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
  });
}

export function useSaveQuote(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["dashboard"],
    successMessage: "Quote saved.",
    mutationFn: async (
      values: {
        id?: string;
        quote: string;
        author?: string | null;
        position: number;
        active: boolean;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        author: values.author ?? null,
      };

      const { error } = values.id
        ? await client
            .from("motivational_quotes")
            .update(payload)
            .eq("id", values.id)
        : await client.from("motivational_quotes").insert(payload);

      if (error) throw error;
    },
  });
}

export function useDeleteQuote(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["dashboard"],
    successMessage: "Quote removed.",
    mutationFn: async (id: string, client) => {
      const { error } = await client.from("motivational_quotes").delete().eq("id", id);
      if (error) throw error;
    },
  });
}

export function useSaveScheduleTemplate(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["dashboard", "training"],
    successMessage: "Schedule item saved.",
    mutationFn: async (
      values: {
        id?: string;
        schedule_type: WeeklyScheduleTemplateRow["schedule_type"];
        weekday: number;
        title: string;
        details?: string | null;
        time_label?: string | null;
        category?: string | null;
        position: number;
      },
      client
    ) => {
      const payload = {
        ...values,
        user_id: userId,
        details: values.details ?? null,
        time_label: values.time_label ?? null,
        category: values.category ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error } = values.id
        ? await client
            .from("weekly_schedule_templates")
            .update(payload)
            .eq("id", values.id)
        : await client.from("weekly_schedule_templates").insert(payload);

      if (error) throw error;
    },
  });
}

export function useDeleteScheduleTemplate(userId: string) {
  return useAppMutation({
    userId,
    scopes: ["dashboard", "training"],
    successMessage: "Schedule item removed.",
    mutationFn: async (id: string, client) => {
      const { error } = await client
        .from("weekly_schedule_templates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  });
}

export function usePendingWeeklyReview(userId: string) {
  return useUserQuery(
    [...queryKeys.review(userId), "pending"],
    async () => {
      const client = createSupabaseBrowserClient();
      const reviews = await fetchWeeklyReviews(client, userId, 14);
      const today = new Date();
      const isSunday = today.getDay() === 0;

      if (!isSunday) return null;

      const weekStart = startOfWeekISO(today);
      return reviews.find((review) => review.week_start === weekStart) ?? {
        week_start: weekStart,
      };
    },
    { refetchOnWindowFocus: true }
  );
}
