import { type HabitDefinition, type GymExercise, type ScheduleType } from "@/types";

export const JANE_STREET_TARGET_DATE = "2026-04-16";

export const CORE_HABITS: HabitDefinition[] = [
  {
    key: "sleep",
    label: "In bed by 10:30pm",
    shortLabel: "Sleep",
    description: "Lights out and in bed by 10:30pm.",
  },
  {
    key: "no_energy_drinks",
    label: "No energy drinks",
    shortLabel: "No energy drinks",
    description: "Skip all energy drinks for the day.",
  },
  {
    key: "planned_tomorrow",
    label: "Planned tomorrow the night before",
    shortLabel: "Plan written",
    description: "Write tomorrow's plan before going to sleep.",
  },
  {
    key: "no_phone_morning",
    label: "No phone for first 15 mins after waking",
    shortLabel: "No phone AM",
    description: "Keep the first 15 minutes phone-free.",
  },
  {
    key: "attended_lectures_fully",
    label: "Attended lectures fully",
    shortLabel: "Lectures",
    description: "Attend lectures without music or distractions.",
  },
  {
    key: "deep_study_morning",
    label: "Hit Jane Street / deep study block in the morning",
    shortLabel: "Deep study",
    description: "Complete the morning deep work block.",
  },
];

export const DASHBOARD_HERO_HABITS = [
  "sleep",
  "no_energy_drinks",
  "planned_tomorrow",
  "attended_lectures_fully",
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/study", label: "Study" },
  { href: "/training", label: "Training" },
  { href: "/finance", label: "Finance" },
  { href: "/habits", label: "Habits" },
  { href: "/review", label: "Review" },
] as const;

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Climbing gear",
  "Supplements",
  "Other",
] as const;

export const CLIMBING_SESSION_TYPES = [
  "technique",
  "strength",
  "project",
  "endurance",
  "recovery",
] as const;

export const GYM_SESSION_TYPES = ["A", "B"] as const;

export const UNI_STATUSES = ["behind", "catching_up", "on_track"] as const;
export const UNI_PRIORITIES = ["high", "medium", "low"] as const;
export const STUDY_TOPIC_STATUSES = [
  "not_started",
  "in_progress",
  "done",
] as const;

export const JANE_STREET_TOPIC_SEED = [
  {
    week: 1,
    title: "Probability fundamentals",
    description: "Refresh conditional probability, Bayes, distributions, and counting tricks.",
  },
  {
    week: 1,
    title: "Expected value & variance",
    description: "Work on EV intuition, variance identities, and fast estimations.",
  },
  {
    week: 1,
    title: "Mental maths speed",
    description: "Daily drills for percentages, fractions, and rough calculations under pressure.",
  },
  {
    week: 1,
    title: "Combinatorics & logic",
    description: "Permutation, combinations, invariants, and structured casework.",
  },
  {
    week: 2,
    title: "Market making & spreads",
    description: "Build intuition for bid/ask, inventory risk, and quoting behavior.",
  },
  {
    week: 2,
    title: "Options intuition",
    description: "Practice payoff diagrams, volatility intuition, and basic option reasoning.",
  },
  {
    week: 2,
    title: "Mock problems (timed)",
    description: "Mix timed drills to simulate pressure and pacing.",
  },
  {
    week: 2,
    title: "Think-aloud practice",
    description: "Practice speaking clearly while solving unfamiliar problems.",
  },
  {
    week: 3,
    title: "Mock interviews",
    description: "Simulate full mock interviews with strict timing.",
  },
  {
    week: 3,
    title: "Weak spot review",
    description: "Target recurring misses from logs and mock sessions.",
  },
  {
    week: 3,
    title: "Day-before rest protocol",
    description: "Set a light review, sleep, food, and movement plan for the final day.",
  },
  {
    week: 3,
    title: "Mindset prep",
    description: "Keep confidence high, nerves low, and execution clean.",
  },
] as const;

export const DEFAULT_QUOTES = [
  {
    quote: "Depth beats drama. Show up calm and let the work compound.",
    author: "Life OS",
  },
  {
    quote: "You do not need a perfect day. You need the next clean rep.",
    author: "Life OS",
  },
  {
    quote: "Consistency is the luxury product. Build that.",
    author: "Life OS",
  },
  {
    quote: "Train focus when you are tired so it is there when it matters.",
    author: "Life OS",
  },
  {
    quote: "Keep the standard high and the mood light.",
    author: "Life OS",
  },
  {
    quote: "Quiet confidence comes from receipts, not vibes.",
    author: "Life OS",
  },
] as const;

export const DEFAULT_DASHBOARD_SCHEDULE = [
  { weekday: 0, time_label: "09:00", title: "Weekly reset", details: "Review notes, plan study blocks, light walk." },
  { weekday: 1, time_label: "08:00", title: "Morning deep study", details: "Probability drills and mental maths." },
  { weekday: 1, time_label: "13:00", title: "Uni lectures", details: "Attend fully and take clean notes." },
  { weekday: 1, time_label: "18:30", title: "Climbing technique", details: "Footwork drills, slab, quiet feet focus." },
  { weekday: 2, time_label: "08:00", title: "Morning deep study", details: "EV and variance reps." },
  { weekday: 2, time_label: "17:30", title: "Gym A", details: "Full body A with progressive overload focus." },
  { weekday: 3, time_label: "08:00", title: "Morning deep study", details: "Options intuition and timed mock problems." },
  { weekday: 3, time_label: "18:30", title: "Climbing strength", details: "Campus board and fingerboard if healthy." },
  { weekday: 4, time_label: "08:00", title: "Morning deep study", details: "Think-aloud practice and review." },
  { weekday: 4, time_label: "19:00", title: "Recovery block", details: "Stretching, mobility, and early sleep." },
  { weekday: 5, time_label: "08:00", title: "Morning deep study", details: "Mock interviews and weak spot review." },
  { weekday: 5, time_label: "17:30", title: "Gym B", details: "Full body B and lift tracking." },
  { weekday: 6, time_label: "10:00", title: "Project day", details: "Pick 1–2 hard problems and work them obsessively." },
  { weekday: 6, time_label: "15:30", title: "Finance reset", details: "Log expenses and tutoring income." },
] as const;

export const DEFAULT_TRAINING_SCHEDULE = [
  { weekday: 1, title: "Climbing", details: "Technique" },
  { weekday: 2, title: "Gym A", details: "Full body A" },
  { weekday: 3, title: "Climbing", details: "Strength" },
  { weekday: 4, title: "Rest", details: "Mobility or nothing" },
  { weekday: 5, title: "Gym B", details: "Full body B" },
  { weekday: 6, title: "Climbing", details: "Project day" },
  { weekday: 0, title: "Rest / Walk", details: "Light walk only" },
] as const;

export const DEFAULT_WORKOUT_TEMPLATES: Array<{
  name: string;
  position: number;
  notes: string;
  exercises: GymExercise[];
}> = [
  {
    name: "Full Body A",
    position: 1,
    notes: "Progressive overload first. No junk cardio.",
    exercises: [
      { name: "Squat", sets: 4, reps: "5", weight_kg: 0 },
      { name: "Romanian Deadlift", sets: 3, reps: "8", weight_kg: 0 },
      { name: "Pull-ups", sets: 4, reps: "max", weight_kg: 0 },
      { name: "Overhead Press", sets: 3, reps: "8", weight_kg: 0 },
      { name: "Dips", sets: 3, reps: "10", weight_kg: 0 },
    ],
  },
  {
    name: "Full Body B",
    position: 2,
    notes: "Stay aggressive on compound lifts and recover well.",
    exercises: [
      { name: "Deadlift", sets: 3, reps: "5", weight_kg: 0 },
      { name: "Bulgarian Split Squat", sets: 3, reps: "8 each", weight_kg: 0 },
      { name: "Barbell Row", sets: 4, reps: "6", weight_kg: 0 },
      { name: "Dumbbell Press", sets: 3, reps: "10", weight_kg: 0 },
      { name: "Face Pulls", sets: 3, reps: "15", weight_kg: 0 },
    ],
  },
];

export const SCHEDULE_TYPE_LABELS: Record<ScheduleType, string> = {
  dashboard: "Daily schedule",
  training: "Training schedule",
};
