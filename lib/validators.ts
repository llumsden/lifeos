import { z } from "zod";

import {
  CLIMBING_SESSION_TYPES,
  CORE_HABITS,
  EXPENSE_CATEGORIES,
  GYM_SESSION_TYPES,
  STUDY_TOPIC_STATUSES,
  UNI_PRIORITIES,
  UNI_STATUSES,
} from "@/lib/constants";

export const authPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password should be at least 6 characters long."),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const topicUpdateSchema = z.object({
  status: z.enum(STUDY_TOPIC_STATUSES),
  notes: z.string().max(4000).optional().nullable(),
});

export const studySessionSchema = z.object({
  date: z.string().min(1),
  topic: z.string().min(1, "Choose or name a topic."),
  duration_minutes: z.coerce.number().int().min(5).max(600),
  confidence: z.coerce.number().int().min(1).max(5),
  notes: z.string().max(4000).optional().nullable(),
});

export const uniSubjectSchema = z.object({
  name: z.string().min(1, "Subject name is required."),
  status: z.enum(UNI_STATUSES),
  priority: z.enum(UNI_PRIORITIES),
  notes: z.string().max(4000).optional().nullable(),
  last_reviewed: z.string().optional().nullable(),
});

export const studyTaskSchema = z.object({
  subject_id: z.string().min(1, "Choose a subject."),
  title: z.string().min(1, "Task title is required."),
  details: z.string().max(4000).optional().nullable(),
  completed: z.boolean(),
  scheduled_for: z.string().optional().nullable(),
  time_label: z.string().max(40).optional().nullable(),
  position: z.coerce.number().int().min(1).max(999),
});

export const studyPromptSchema = z.object({
  label: z.string().min(1, "Prompt label is required.").max(120),
  prompt: z.string().min(1, "Prompt copy is required.").max(8000),
  position: z.coerce.number().int().min(1).max(999),
});

export const climbingSessionSchema = z.object({
  date: z.string().min(1),
  session_type: z.enum(CLIMBING_SESSION_TYPES),
  grade_achieved: z.string().max(32).optional().nullable(),
  volume: z.coerce.number().int().min(0).max(1000).optional().nullable(),
  energy_level: z.coerce.number().int().min(1).max(5),
  notes: z.string().max(4000).optional().nullable(),
});

export const gymExerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.coerce.number().int().min(1).max(12),
  reps: z.string().min(1).max(40),
  weight_kg: z.coerce.number().min(0).max(500),
});

export const gymSessionSchema = z.object({
  date: z.string().min(1),
  session_type: z.enum(GYM_SESSION_TYPES),
  exercises: z.array(gymExerciseSchema).min(1, "Add at least one exercise."),
  notes: z.string().max(4000).optional().nullable(),
});

export const workoutTemplateSchema = z.object({
  name: z.string().min(1),
  notes: z.string().max(4000).optional().nullable(),
  exercises: z.array(gymExerciseSchema).min(1),
});

export const expenseSchema = z.object({
  date: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  category: z.enum(EXPENSE_CATEGORIES),
  note: z.string().max(4000).optional().nullable(),
});

export const incomeSchema = z.object({
  date: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  source: z.string().min(1, "Add an income source."),
  note: z.string().max(4000).optional().nullable(),
});

export const tutoringSessionSchema = z.object({
  date: z.string().min(1),
  client_name: z.string().min(1, "Client name is required."),
  duration_minutes: z.coerce.number().int().min(15).max(600),
  rate_per_hour: z.coerce.number().positive("Rate must be greater than zero."),
  paid: z.boolean(),
  notes: z.string().max(4000).optional().nullable(),
});

export const weeklyReviewSchema = z.object({
  week_start: z.string().min(1),
  went_well: z.string().min(1, "Write at least one win."),
  slipped: z.string().min(1, "Capture what slipped."),
  plan_next_week: z.string().min(1, "Set a plan for next week."),
  rating: z.coerce.number().int().min(1).max(5),
});

export const quoteSchema = z.object({
  quote: z.string().min(1).max(280),
  author: z.string().max(120).optional().nullable(),
});

export const scheduleTemplateSchema = z.object({
  schedule_type: z.enum(["dashboard", "training"]),
  weekday: z.coerce.number().int().min(0).max(6),
  title: z.string().min(1).max(120),
  details: z.string().max(4000).optional().nullable(),
  time_label: z.string().max(40).optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  position: z.coerce.number().int().min(1).max(20),
});

export const profileSettingsSchema = z.object({
  display_name: z.string().max(120).optional().nullable(),
  weekly_budget_limit: z.coerce.number().min(0),
  current_weight_kg: z.coerce.number().min(0),
  target_weight_kg: z.coerce.number().min(0),
  height_cm: z.coerce.number().min(0),
});

export const habitChecklistSchema = z.object({
  date: z.string().min(1),
  sleep: z.boolean(),
  no_energy_drinks: z.boolean(),
  planned_tomorrow: z.boolean(),
  no_phone_morning: z.boolean(),
  attended_lectures_fully: z.boolean(),
  deep_study_morning: z.boolean(),
});

export const habitKeys = CORE_HABITS.map((habit) => habit.key);

export type AuthPasswordValues = z.infer<typeof authPasswordSchema>;
export type MagicLinkValues = z.infer<typeof magicLinkSchema>;
export type TopicUpdateValues = z.infer<typeof topicUpdateSchema>;
export type StudySessionValues = z.infer<typeof studySessionSchema>;
export type UniSubjectValues = z.infer<typeof uniSubjectSchema>;
export type StudyTaskValues = z.infer<typeof studyTaskSchema>;
export type StudyPromptValues = z.infer<typeof studyPromptSchema>;
export type ClimbingSessionValues = z.infer<typeof climbingSessionSchema>;
export type GymSessionValues = z.infer<typeof gymSessionSchema>;
export type WorkoutTemplateValues = z.infer<typeof workoutTemplateSchema>;
export type ExpenseValues = z.infer<typeof expenseSchema>;
export type IncomeValues = z.infer<typeof incomeSchema>;
export type TutoringSessionValues = z.infer<typeof tutoringSessionSchema>;
export type WeeklyReviewValues = z.infer<typeof weeklyReviewSchema>;
export type QuoteValues = z.infer<typeof quoteSchema>;
export type ScheduleTemplateValues = z.infer<typeof scheduleTemplateSchema>;
export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
export type HabitChecklistValues = z.infer<typeof habitChecklistSchema>;
