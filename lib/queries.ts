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

import {
  CORE_HABITS,
  DASHBOARD_HERO_HABITS,
  DEFAULT_QUOTES,
  DEFAULT_TRAINING_SCHEDULE,
} from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  calculateHabitStreaks,
  getTodayISO,
  startOfWeekISO,
} from "@/lib/utils";
import type {
  ClimbingSessionRow,
  DashboardPageData,
  ExpenseRow,
  FinancePageData,
  GymSessionRow,
  GymWorkoutTemplateRow,
  HabitKey,
  HabitLogRow,
  HabitsPageData,
  IncomeEntryRow,
  JaneStreetTopicRow,
  MotivationalQuoteRow,
  ReviewPageData,
  StudyPageData,
  StudySessionRow,
  TrainingPageData,
  TutoringSessionRow,
  UniSubjectRow,
  UserProfileRow,
  WeeklyReviewRow,
  WeeklyScheduleTemplateRow,
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

async function maybeSingle<T>(promise: PromiseLike<{ data: T | null; error: unknown }>) {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
}

async function maybeMany<T>(
  promise: PromiseLike<{ data: T[] | null; error: unknown }>
) {
  const { data, error } = await promise;
  if (error) throw error;
  return data ?? [];
}

async function fetchProfile(client: Client, userId: string) {
  return maybeSingle<UserProfileRow>(
    client.from("user_profiles").select("*").eq("user_id", userId).maybeSingle()
  );
}

async function fetchQuotes(client: Client, userId: string) {
  const quotes = await maybeMany<MotivationalQuoteRow>(
    client
      .from("motivational_quotes")
      .select("*")
      .eq("user_id", userId)
      .eq("active", true)
      .order("position", { ascending: true })
  );

  return quotes.length > 0
    ? quotes
    : DEFAULT_QUOTES.map((quote, index) => ({
        id: `fallback-quote-${index}`,
        user_id: userId,
        quote: quote.quote,
        author: quote.author,
        position: index + 1,
        active: true,
        created_at: new Date().toISOString(),
      }));
}

async function fetchSchedule(
  client: Client,
  userId: string,
  scheduleType: "dashboard" | "training",
  weekday?: number
) {
  let query = client
    .from("weekly_schedule_templates")
    .select("*")
    .eq("user_id", userId)
    .eq("schedule_type", scheduleType)
    .order("weekday", { ascending: true })
    .order("position", { ascending: true });

  if (typeof weekday === "number") {
    query = query.eq("weekday", weekday);
  }

  const rows = await maybeMany<WeeklyScheduleTemplateRow>(query);

  if (rows.length > 0) return rows;

  if (scheduleType === "training") {
    return DEFAULT_TRAINING_SCHEDULE.map(
      (item, index) =>
        ({
          id: `fallback-training-${index}`,
          user_id: userId,
          schedule_type: "training",
          weekday: item.weekday,
          title: item.title,
          details: item.details,
          time_label: null,
          category: "training",
          position: index + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }) satisfies WeeklyScheduleTemplateRow
    );
  }

  return [];
}

async function fetchHabitLogs(client: Client, userId: string, daysBack = 365) {
  const startDate = format(addDays(new Date(), -daysBack), "yyyy-MM-dd");

  return maybeMany<HabitLogRow>(
    client
      .from("habits_log")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .order("date", { ascending: false })
  );
}

async function fetchStudySessions(client: Client, userId: string, daysBack = 60) {
  const startDate = format(addDays(new Date(), -daysBack), "yyyy-MM-dd");

  return maybeMany<StudySessionRow>(
    client
      .from("study_sessions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
  );
}

async function fetchJaneStreetTopics(client: Client, userId: string) {
  return maybeMany<JaneStreetTopicRow>(
    client
      .from("jane_street_topics")
      .select("*")
      .eq("user_id", userId)
      .order("week", { ascending: true })
      .order("title", { ascending: true })
  );
}

async function fetchUniSubjects(client: Client, userId: string) {
  return maybeMany<UniSubjectRow>(
    client
      .from("uni_subjects")
      .select("*")
      .eq("user_id", userId)
      .order("priority", { ascending: true })
      .order("updated_at", { ascending: false })
  );
}

async function fetchClimbingSessions(client: Client, userId: string, daysBack = 120) {
  const startDate = format(addDays(new Date(), -daysBack), "yyyy-MM-dd");

  return maybeMany<ClimbingSessionRow>(
    client
      .from("climbing_sessions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .order("date", { ascending: false })
  );
}

async function fetchGymSessions(client: Client, userId: string, daysBack = 120) {
  const startDate = format(addDays(new Date(), -daysBack), "yyyy-MM-dd");

  return maybeMany<GymSessionRow>(
    client
      .from("gym_sessions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .order("date", { ascending: false })
  );
}

async function fetchWorkoutTemplates(client: Client, userId: string) {
  return maybeMany<GymWorkoutTemplateRow>(
    client
      .from("gym_workout_templates")
      .select("*")
      .eq("user_id", userId)
      .order("position", { ascending: true })
  );
}

async function fetchExpenses(client: Client, userId: string, daysBack = 365) {
  const startDate = format(addDays(new Date(), -daysBack), "yyyy-MM-dd");

  return maybeMany<ExpenseRow>(
    client
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .order("date", { ascending: false })
  );
}

async function fetchIncomeEntries(client: Client, userId: string, daysBack = 365) {
  const startDate = format(addDays(new Date(), -daysBack), "yyyy-MM-dd");

  return maybeMany<IncomeEntryRow>(
    client
      .from("income_entries")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .order("date", { ascending: false })
  );
}

async function fetchTutoringSessions(
  client: Client,
  userId: string,
  daysBack = 365
) {
  const startDate = format(addDays(new Date(), -daysBack), "yyyy-MM-dd");

  return maybeMany<TutoringSessionRow>(
    client
      .from("tutoring_sessions")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .order("date", { ascending: false })
  );
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
  const today = getTodayISO();
  const weekday = new Date().getDay();

  const [profile, quotes, schedule, habitLogs] = await Promise.all([
    fetchProfile(client, userId),
    fetchQuotes(client, userId),
    fetchSchedule(client, userId, "dashboard", weekday),
    fetchHabitLogs(client, userId, 90),
  ]);

  return {
    today,
    heroHabitKeys: [...DASHBOARD_HERO_HABITS] as HabitKey[],
    quotes,
    profile,
    schedule,
    habitLogs,
    streaks: calculateHabitStreaks(habitLogs),
  } satisfies DashboardPageData;
}

export async function getStudyPageData(client: Client, userId: string) {
  const [topics, sessions, subjects] = await Promise.all([
    fetchJaneStreetTopics(client, userId),
    fetchStudySessions(client, userId),
    fetchUniSubjects(client, userId),
  ]);

  return {
    today: getTodayISO(),
    topics,
    sessions,
    subjects,
  } satisfies StudyPageData;
}

export async function getTrainingPageData(client: Client, userId: string) {
  const [profile, climbingSessions, gymSessions, workoutTemplates, schedule] =
    await Promise.all([
      fetchProfile(client, userId),
      fetchClimbingSessions(client, userId),
      fetchGymSessions(client, userId),
      fetchWorkoutTemplates(client, userId),
      fetchSchedule(client, userId, "training"),
    ]);

  return {
    today: getTodayISO(),
    profile,
    climbingSessions,
    gymSessions,
    workoutTemplates,
    schedule,
  } satisfies TrainingPageData;
}

export async function getFinancePageData(client: Client, userId: string) {
  const [profile, expenses, incomeEntries, tutoringSessions] = await Promise.all([
    fetchProfile(client, userId),
    fetchExpenses(client, userId),
    fetchIncomeEntries(client, userId),
    fetchTutoringSessions(client, userId),
  ]);

  return {
    today: getTodayISO(),
    profile,
    expenses,
    incomeEntries,
    tutoringSessions,
  } satisfies FinancePageData;
}

export async function getHabitsPageData(client: Client, userId: string) {
  const [habitLogs, reviews] = await Promise.all([
    fetchHabitLogs(client, userId),
    fetchWeeklyReviews(client, userId),
  ]);

  return {
    today: getTodayISO(),
    habitLogs,
    reviews,
  } satisfies HabitsPageData;
}

export async function getReviewPageData(client: Client, userId: string) {
  const reviews = await fetchWeeklyReviews(client, userId, 1000);

  return {
    reviews,
  } satisfies ReviewPageData;
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
    return getDashboardPageData(client, userId);
  }, { initialData });
}

export function useStudyData(userId: string, initialData: StudyPageData) {
  return useUserQuery(queryKeys.study(userId), () => {
    const client = createSupabaseBrowserClient();
    return getStudyPageData(client, userId);
  }, { initialData });
}

export function useTrainingData(userId: string, initialData: TrainingPageData) {
  return useUserQuery(queryKeys.training(userId), () => {
    const client = createSupabaseBrowserClient();
    return getTrainingPageData(client, userId);
  }, { initialData });
}

export function useFinanceData(userId: string, initialData: FinancePageData) {
  return useUserQuery(queryKeys.finance(userId), () => {
    const client = createSupabaseBrowserClient();
    return getFinancePageData(client, userId);
  }, { initialData });
}

export function useHabitsData(userId: string, initialData: HabitsPageData) {
  return useUserQuery(queryKeys.habits(userId), () => {
    const client = createSupabaseBrowserClient();
    return getHabitsPageData(client, userId);
  }, { initialData });
}

export function useReviewData(userId: string, initialData: ReviewPageData) {
  return useUserQuery(queryKeys.review(userId), () => {
    const client = createSupabaseBrowserClient();
    return getReviewPageData(client, userId);
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
