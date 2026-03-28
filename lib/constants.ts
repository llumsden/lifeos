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

export const CLIMBING_POWER_RULES = [
  {
    title: "5% drop-off rule",
    description:
      "If max hang weight feels unholdable or campus reach drops by half a rung, terminate the power block immediately.",
  },
  {
    title: "Standard warm-up",
    description:
      "5 mins pulse raiser, 10 mins dynamic mobility, 15 mins easy traversing to V4/V5, 3 sets of 5 scapular pull-ups, then 3 progressive hangboard hangs at 50%, 70%, and 90%.",
  },
  {
    title: "Sleep target",
    description:
      "Hold 8.5 to 9 hours strictly. CNS recovery dictates the output of this block.",
  },
] as const;

export const CLIMBING_POWER_PLAN = [
  {
    day: "Day 1",
    title: "Absolute Power & Neural Recruitment",
    subtitle: "Off-wall",
    job: "Maximize peak force in the fingers and fast-twitch recruitment in the pulling muscles.",
    blocks: [
      "Max hangboard: half-crimp on 20mm, 10-second hang, 5 sets at 90-95% 1RM with 3 mins rest. Cue: bend the wood.",
      "Campus max skips: 3 sets leading left and 3 sets leading right, 3 mins rest. Cue: hips to the board.",
      "Campus double dyno snatches: 4 sets on 1-4 or 1-5 with strict drop-offs.",
      "OAP bridge: pulley-assisted concentrics and lock-off focus to bridge from archer pull-ups to true one-arm strength.",
    ],
  },
  {
    day: "Day 2",
    title: "Unilateral Strength & Lock-Off Architecture",
    subtitle: "Strength support",
    job: "Build the lat, biceps, brachialis, and static catch strength needed for OAP progress and hard catches.",
    blocks: [
      "Pulley-assisted one-arm pull-ups: 4 sets of 2 reps per arm, 3 mins rest. Remove just enough weight to fail at rep 3.",
      "Weighted two-arm lock-offs: 3 sets at 90 degrees and 3 sets at 120 degrees, 8 seconds per hold with 2.5 mins rest.",
      "Front lever holds or regressions: 4 sets of 10 seconds for posterior chain and core tension.",
    ],
  },
  {
    day: "Day 3",
    title: "Restoration & Antagonist Alignment",
    subtitle: "No climbing",
    job: "Flush the forearms, repair elbows, and keep the pushing chain balanced to avoid medial elbow pain.",
    blocks: [
      "Overhead dumbbell press: 4 sets of 8 reps at a moderate load.",
      "Ring dips or strict push-ups: 4 sets stopping 2 reps before failure.",
      "Reverse wrist curls: 3 sets of 15 per arm.",
      "Finger extensions against a band: 50 full reps.",
    ],
  },
  {
    day: "Day 4",
    title: "Wall Translation & Kinetic Chains",
    subtitle: "On-wall",
    job: "Translate off-wall power into timing, coordination, and confident flight on steep terrain.",
    blocks: [
      "Symmetrical plyometrics: 6 total double-dyno attempts on a 20-30 degree overhang with 2 mins rest. Cue: push through the toes until they leave the wall.",
      "Limit bouldering: 3 boulders at 1-2 grades above max, 5 attempts each, 3 mins rest, 45-minute hard cap.",
      "If you stick the move, drop off. Do not turn the session into endurance work.",
    ],
  },
  {
    day: "Day 5",
    title: "Total CNS Rest",
    subtitle: "Recovery",
    job: "Clear fatigue from the high-velocity work and protect the next power session.",
    blocks: [
      "Do nothing taxing. No climbing, no lifting, no hanging.",
      "Keep 15 minutes of lower-body mobility for hips and hamstrings.",
      "Hydrate hard and spike protein intake.",
    ],
  },
  {
    day: "Day 6",
    title: "Capacity Power & Contact Strength",
    subtitle: "Power endurance",
    job: "Sustain high power across multiple moves and hard dynamic catches.",
    blocks: [
      "Campus ladders: 4 sets of 1-2-3-4-5-6-7-8-9 on medium rungs at max speed with 3 mins rest.",
      "Plyometric touches: 3 sets of 3 touches per arm with 2 mins rest. Cue: stiff fingers on the catch.",
      "Weighted pull-ups: 4 sets of 4 reps at roughly 130% bodyweight or whatever load gives a true 4RM.",
    ],
  },
  {
    day: "Day 7",
    title: "Complete Rest",
    subtitle: "Adaptation",
    job: "Growth happens here. Let the nervous system and connective tissue absorb the block.",
    blocks: [
      "Zero climbing and zero lifting.",
      "Light walking or easy stretching only.",
    ],
  },
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
