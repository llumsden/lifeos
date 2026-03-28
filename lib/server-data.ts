import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, format } from "date-fns";

import {
  DASHBOARD_HERO_HABITS,
  DEFAULT_QUOTES,
  DEFAULT_TRAINING_SCHEDULE,
} from "@/lib/constants";
import { calculateHabitStreaks, getTodayISO } from "@/lib/utils";
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
  StudyAIPromptRow,
  StudyPageData,
  StudySessionRow,
  StudyTaskRow,
  TrainingPageData,
  TutoringSessionRow,
  UniSubjectRow,
  UserProfileRow,
  WeeklyReviewRow,
  WeeklyScheduleTemplateRow,
} from "@/types";

type Client = SupabaseClient;

async function maybeSingle<T>(
  promise: PromiseLike<{ data: T | null; error: unknown }>
) {
  const { data, error } = await promise;

  if (error) {
    throw error;
  }

  return data;
}

async function maybeMany<T>(
  promise: PromiseLike<{ data: T[] | null; error: unknown }>
) {
  const { data, error } = await promise;

  if (error) {
    throw error;
  }

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

  if (rows.length > 0) {
    return rows;
  }

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

async function fetchStudyTasks(client: Client, userId: string) {
  return maybeMany<StudyTaskRow>(
    client
      .from("study_tasks")
      .select("*")
      .eq("user_id", userId)
      .order("completed", { ascending: true })
      .order("scheduled_for", { ascending: true, nullsFirst: false })
      .order("time_label", { ascending: true, nullsFirst: false })
      .order("position", { ascending: true })
      .order("updated_at", { ascending: false })
  );
}

async function fetchStudyAIPrompts(client: Client, userId: string) {
  return maybeMany<StudyAIPromptRow>(
    client
      .from("study_ai_prompts")
      .select("*")
      .eq("user_id", userId)
      .order("position", { ascending: true })
      .order("updated_at", { ascending: false })
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

  const [profile, quotes, schedule, habitLogs, subjects, tasks] = await Promise.all([
    fetchProfile(client, userId),
    fetchQuotes(client, userId),
    fetchSchedule(client, userId, "dashboard", weekday),
    fetchHabitLogs(client, userId, 90),
    fetchUniSubjects(client, userId),
    fetchStudyTasks(client, userId),
  ]);

  const subjectNameMap = new Map(subjects.map((subject) => [subject.id, subject.name]));
  const todaysStudyTasks = tasks
    .filter((task) => task.scheduled_for === today)
    .map((task) => ({
      ...task,
      subject_name: subjectNameMap.get(task.subject_id) ?? null,
    }));

  return {
    today,
    heroHabitKeys: [...DASHBOARD_HERO_HABITS] as HabitKey[],
    quotes,
    profile,
    schedule,
    studyTasks: todaysStudyTasks,
    habitLogs,
    streaks: calculateHabitStreaks(habitLogs),
  } satisfies DashboardPageData;
}

export async function getStudyPageData(client: Client, userId: string) {
  const [topics, sessions, subjects, tasks, prompts] = await Promise.all([
    fetchJaneStreetTopics(client, userId),
    fetchStudySessions(client, userId),
    fetchUniSubjects(client, userId),
    fetchStudyTasks(client, userId),
    fetchStudyAIPrompts(client, userId),
  ]);

  const subjectNameMap = new Map(subjects.map((subject) => [subject.id, subject.name]));
  const enrichedTasks = tasks.map((task) => ({
    ...task,
    subject_name: subjectNameMap.get(task.subject_id) ?? null,
  }));

  return {
    today: getTodayISO(),
    topics,
    sessions,
    subjects,
    tasks: enrichedTasks,
    prompts,
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
