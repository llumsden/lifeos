export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type HabitKey =
  | "sleep"
  | "no_energy_drinks"
  | "planned_tomorrow"
  | "no_phone_morning"
  | "attended_lectures_fully"
  | "deep_study_morning";

export type StudyTopicStatus = "not_started" | "in_progress" | "done";
export type UniSubjectStatus = "behind" | "catching_up" | "on_track";
export type UniSubjectPriority = "high" | "medium" | "low";
export type ClimbingSessionType =
  | "technique"
  | "strength"
  | "project"
  | "endurance"
  | "recovery";
export type GymSessionType = "A" | "B";
export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Climbing gear"
  | "Supplements"
  | "Other";
export type ScheduleType = "dashboard" | "training";

export interface GymExercise {
  name: string;
  sets: number;
  reps: string;
  weight_kg: number;
}

export interface HabitDefinition {
  key: HabitKey;
  label: string;
  shortLabel: string;
  description: string;
}

export interface HabitLogRow {
  id: string;
  user_id: string;
  date: string;
  habit_key: HabitKey;
  completed: boolean;
  created_at: string;
}

export interface StudySessionRow {
  id: string;
  user_id: string;
  date: string;
  topic: string;
  duration_minutes: number;
  confidence: number;
  notes: string | null;
  created_at: string;
}

export interface JaneStreetTopicRow {
  id: string;
  user_id: string;
  week: number;
  title: string;
  description: string | null;
  status: StudyTopicStatus;
  notes: string | null;
  updated_at: string;
}

export interface UniSubjectRow {
  id: string;
  user_id: string;
  name: string;
  status: UniSubjectStatus;
  priority: UniSubjectPriority;
  notes: string | null;
  last_reviewed: string | null;
  updated_at: string;
}

export interface ClimbingSessionRow {
  id: string;
  user_id: string;
  date: string;
  session_type: ClimbingSessionType;
  grade_achieved: string | null;
  volume: number | null;
  energy_level: number | null;
  notes: string | null;
  created_at: string;
}

export interface GymSessionRow {
  id: string;
  user_id: string;
  date: string;
  session_type: GymSessionType;
  exercises: GymExercise[] | null;
  notes: string | null;
  created_at: string;
}

export interface ExpenseRow {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  note: string | null;
  created_at: string;
}

export interface IncomeEntryRow {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  source: string;
  note: string | null;
  created_at: string;
}

export interface TutoringSessionRow {
  id: string;
  user_id: string;
  date: string;
  client_name: string | null;
  duration_minutes: number | null;
  rate_per_hour: number | null;
  paid: boolean;
  notes: string | null;
  created_at: string;
}

export interface WeeklyReviewRow {
  id: string;
  user_id: string;
  week_start: string;
  went_well: string | null;
  slipped: string | null;
  plan_next_week: string | null;
  rating: number | null;
  created_at: string;
}

export interface UserProfileRow {
  user_id: string;
  display_name: string | null;
  weekly_budget_limit: number;
  current_weight_kg: number;
  target_weight_kg: number;
  height_cm: number;
  interview_target_date: string;
  created_at: string;
  updated_at: string;
}

export interface MotivationalQuoteRow {
  id: string;
  user_id: string;
  quote: string;
  author: string | null;
  position: number;
  active: boolean;
  created_at: string;
}

export interface WeeklyScheduleTemplateRow {
  id: string;
  user_id: string;
  schedule_type: ScheduleType;
  weekday: number;
  title: string;
  details: string | null;
  time_label: string | null;
  category: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface GymWorkoutTemplateRow {
  id: string;
  user_id: string;
  name: string;
  position: number;
  exercises: GymExercise[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardPageData {
  today: string;
  heroHabitKeys: HabitKey[];
  quotes: MotivationalQuoteRow[];
  profile: UserProfileRow | null;
  schedule: WeeklyScheduleTemplateRow[];
  habitLogs: HabitLogRow[];
  streaks: Record<HabitKey, number>;
}

export interface StudyPageData {
  today: string;
  topics: JaneStreetTopicRow[];
  sessions: StudySessionRow[];
  subjects: UniSubjectRow[];
}

export interface TrainingPageData {
  today: string;
  profile: UserProfileRow | null;
  climbingSessions: ClimbingSessionRow[];
  gymSessions: GymSessionRow[];
  workoutTemplates: GymWorkoutTemplateRow[];
  schedule: WeeklyScheduleTemplateRow[];
}

export interface FinancePageData {
  today: string;
  profile: UserProfileRow | null;
  expenses: ExpenseRow[];
  incomeEntries: IncomeEntryRow[];
  tutoringSessions: TutoringSessionRow[];
}

export interface HabitsPageData {
  today: string;
  habitLogs: HabitLogRow[];
  reviews: WeeklyReviewRow[];
}

export interface ReviewPageData {
  reviews: WeeklyReviewRow[];
}

export interface Database {
  public: {
    Tables: {
      habits_log: {
        Row: HabitLogRow;
        Insert: Omit<HabitLogRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<HabitLogRow>;
      };
      study_sessions: {
        Row: StudySessionRow;
        Insert: Omit<StudySessionRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<StudySessionRow>;
      };
      jane_street_topics: {
        Row: JaneStreetTopicRow;
        Insert: Omit<JaneStreetTopicRow, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<JaneStreetTopicRow>;
      };
      uni_subjects: {
        Row: UniSubjectRow;
        Insert: Omit<UniSubjectRow, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<UniSubjectRow>;
      };
      climbing_sessions: {
        Row: ClimbingSessionRow;
        Insert: Omit<ClimbingSessionRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ClimbingSessionRow>;
      };
      gym_sessions: {
        Row: GymSessionRow;
        Insert: Omit<GymSessionRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<GymSessionRow>;
      };
      expenses: {
        Row: ExpenseRow;
        Insert: Omit<ExpenseRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ExpenseRow>;
      };
      income_entries: {
        Row: IncomeEntryRow;
        Insert: Omit<IncomeEntryRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<IncomeEntryRow>;
      };
      tutoring_sessions: {
        Row: TutoringSessionRow;
        Insert: Omit<TutoringSessionRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<TutoringSessionRow>;
      };
      weekly_reviews: {
        Row: WeeklyReviewRow;
        Insert: Omit<WeeklyReviewRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<WeeklyReviewRow>;
      };
      user_profiles: {
        Row: UserProfileRow;
        Insert: Omit<UserProfileRow, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<UserProfileRow>;
      };
      motivational_quotes: {
        Row: MotivationalQuoteRow;
        Insert: Omit<MotivationalQuoteRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MotivationalQuoteRow>;
      };
      weekly_schedule_templates: {
        Row: WeeklyScheduleTemplateRow;
        Insert: Omit<
          WeeklyScheduleTemplateRow,
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<WeeklyScheduleTemplateRow>;
      };
      gym_workout_templates: {
        Row: GymWorkoutTemplateRow;
        Insert: Omit<GymWorkoutTemplateRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<GymWorkoutTemplateRow>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      bootstrap_user_defaults: {
        Args: { user_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
