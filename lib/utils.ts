import { type ClassValue, clsx } from "clsx";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { twMerge } from "tailwind-merge";

import { CORE_HABITS, JANE_STREET_TARGET_DATE } from "@/lib/constants";
import type {
  ClimbingSessionRow,
  ExpenseRow,
  GymSessionRow,
  HabitKey,
  HabitLogRow,
  IncomeEntryRow,
  StudySessionRow,
  TutoringSessionRow,
  WeeklyReviewRow,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateLabel(date: string | Date, pattern = "EEE, d MMM") {
  return format(typeof date === "string" ? parseISO(date) : date, pattern);
}

export function getTodayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function calculateCountdownDays(fromDate = new Date()) {
  const target = startOfDay(parseISO(JANE_STREET_TARGET_DATE));
  const current = startOfDay(fromDate);

  return Math.max(
    Math.ceil((target.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function startOfWeekISO(date = new Date()) {
  return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
}

export function getCurrentWeekDates(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });

  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function getHabitCompletionMap(logs: HabitLogRow[], date: string) {
  const map = Object.fromEntries(
    CORE_HABITS.map((habit) => [habit.key, false])
  ) as Record<HabitKey, boolean>;

  logs
    .filter((log) => log.date === date)
    .forEach((log) => {
      map[log.habit_key] = log.completed;
    });

  return map;
}

export function calculateHabitStreaks(logs: HabitLogRow[], today = new Date()) {
  const streaks = Object.fromEntries(
    CORE_HABITS.map((habit) => [habit.key, 0])
  ) as Record<HabitKey, number>;

  const byHabit = new Map<HabitKey, Map<string, boolean>>();
  CORE_HABITS.forEach((habit) => byHabit.set(habit.key, new Map()));

  logs.forEach((log) => {
    byHabit.get(log.habit_key)?.set(log.date, log.completed);
  });

  CORE_HABITS.forEach((habit) => {
    let cursor = startOfDay(today);
    let streak = 0;

    while (true) {
      const key = format(cursor, "yyyy-MM-dd");
      const completed = byHabit.get(habit.key)?.get(key);

      if (!completed) break;

      streak += 1;
      cursor = addDays(cursor, -1);
    }

    streaks[habit.key] = streak;
  });

  return streaks;
}

export function getDailyStudyMinutes(sessions: StudySessionRow[], days = 14) {
  const end = new Date();
  const start = addDays(end, -(days - 1));
  const dates = eachDayOfInterval({ start, end });

  return dates.map((date) => {
    const iso = format(date, "yyyy-MM-dd");
    const minutes = sessions
      .filter((session) => session.date === iso)
      .reduce((sum, session) => sum + session.duration_minutes, 0);

    return {
      date: format(date, "MMM d"),
      minutes,
      iso,
    };
  });
}

export function getMonthlyExpenseTotals(expenses: ExpenseRow[], months = 6) {
  const now = new Date();

  return Array.from({ length: months }, (_, index) => {
    const monthDate = startOfMonth(addDays(startOfMonth(now), -index * 31));
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const total = expenses
      .filter((expense) => {
        const date = parseISO(expense.date);
        return date >= start && date <= end;
      })
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    return {
      month: format(start, "MMM"),
      total,
    };
  }).reverse();
}

export function getRunningBalance(
  expenses: ExpenseRow[],
  incomeEntries: IncomeEntryRow[],
  tutoringSessions: TutoringSessionRow[]
) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );
  const income = incomeEntries.reduce(
    (sum, entry) => sum + Number(entry.amount),
    0
  );
  const tutoringIncome = tutoringSessions
    .filter((session) => session.paid)
    .reduce((sum, session) => {
      const duration = session.duration_minutes ?? 0;
      const rate = Number(session.rate_per_hour ?? 0);

      return sum + (duration / 60) * rate;
    }, 0);

  return income + tutoringIncome - totalExpenses;
}

export function getWeeklyExpenseTotal(expenses: ExpenseRow[], date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return expenses
    .filter((expense) => {
      const entryDate = parseISO(expense.date);
      return entryDate >= start && entryDate <= end;
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
}

export function parseClimbingGrade(grade: string | null) {
  if (!grade) return null;

  const vGrade = grade.toUpperCase().match(/^V(\d+)(\+)?$/);
  if (vGrade) return Number(vGrade[1]) + (vGrade[2] ? 0.25 : 0);

  const fontGrade = grade.toUpperCase().match(/^(\d)([ABC])(\+)?$/);
  if (fontGrade) {
    const base = Number(fontGrade[1]) * 3;
    const letterOffset = { A: 0, B: 1, C: 2 }[fontGrade[2] as "A" | "B" | "C"];
    return base + letterOffset + (fontGrade[3] ? 0.5 : 0);
  }

  return null;
}

export function getGradeTrend(climbingSessions: ClimbingSessionRow[]) {
  return climbingSessions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((session) => ({
      date: format(parseISO(session.date), "MMM d"),
      label: session.grade_achieved ?? "N/A",
      score: parseClimbingGrade(session.grade_achieved),
    }))
    .filter((entry) => entry.score !== null);
}

export function getClimbingWeeklySummary(
  climbingSessions: ClimbingSessionRow[],
  date = new Date()
) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  const weekSessions = climbingSessions.filter((session) => {
    const sessionDate = parseISO(session.date);
    return sessionDate >= start && sessionDate <= end;
  });

  const totalSessions = weekSessions.length;
  const avgEnergy =
    totalSessions === 0
      ? 0
      : weekSessions.reduce(
          (sum, session) => sum + Number(session.energy_level ?? 0),
          0
        ) / totalSessions;

  return {
    totalSessions,
    avgEnergy,
  };
}

export function getProgressiveOverloadFlags(gymSessions: GymSessionRow[]) {
  const exerciseMap = new Map<string, Array<{ date: string; weight: number }>>();

  gymSessions.forEach((session) => {
    (session.exercises ?? []).forEach((exercise) => {
      if (!exerciseMap.has(exercise.name)) {
        exerciseMap.set(exercise.name, []);
      }

      exerciseMap.get(exercise.name)?.push({
        date: session.date,
        weight: Number(exercise.weight_kg),
      });
    });
  });

  return Array.from(exerciseMap.entries()).flatMap(([name, entries]) => {
    const sorted = entries
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-4);

    if (sorted.length < 4) return [];

    const lastThree = sorted.slice(1);
    const previousBest = Math.max(...sorted.slice(0, -1).map((entry) => entry.weight));
    const latestBest = Math.max(...lastThree.map((entry) => entry.weight));

    if (latestBest <= previousBest) {
      return [
        {
          name,
          sessionsWithoutProgress: lastThree.length,
        },
      ];
    }

    return [];
  });
}

export function getHeatmapCells(logs: HabitLogRow[], days = 365) {
  const end = new Date();
  const start = addDays(end, -(days - 1));
  const dates = eachDayOfInterval({ start, end });

  return dates.map((date) => {
    const iso = format(date, "yyyy-MM-dd");
    const completed = logs.filter(
      (log) => log.date === iso && log.completed === true
    ).length;

    return {
      date: iso,
      count: completed,
      label: format(date, "MMM d"),
    };
  });
}

export function getWeekColumnsForHeatmap(logs: HabitLogRow[], days = 365) {
  const cells = getHeatmapCells(logs, days);
  const paddedStart = startOfWeek(parseISO(cells[0].date), { weekStartsOn: 0 });
  const paddedEnd = endOfWeek(parseISO(cells[cells.length - 1].date), {
    weekStartsOn: 0,
  });

  const allDates = eachDayOfInterval({ start: paddedStart, end: paddedEnd });

  const cellMap = new Map(cells.map((cell) => [cell.date, cell]));
  const weeks: Array<
    Array<{ date: string; count: number; label: string; placeholder?: boolean }>
  > = [];

  allDates.forEach((date, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!weeks[weekIndex]) weeks[weekIndex] = [];

    const iso = format(date, "yyyy-MM-dd");
    const existing = cellMap.get(iso);

    weeks[weekIndex].push(
      existing ?? {
        date: iso,
        count: 0,
        label: format(date, "MMM d"),
        placeholder: true,
      }
    );
  });

  return weeks;
}

export function getStudyProgress(topics: Array<{ status: string }>) {
  if (topics.length === 0) return 0;

  const done = topics.filter((topic) => topic.status === "done").length;

  return Math.round((done / topics.length) * 100);
}

export function getPendingSundayReview(reviews: WeeklyReviewRow[], today = new Date()) {
  const isSunday = today.getDay() === 0;
  if (!isSunday) return null;

  const weekStart = startOfWeekISO(today);
  const review = reviews.find((entry) => entry.week_start === weekStart);

  return review ?? { week_start: weekStart };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-AU", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function getCompletionIntensity(count: number) {
  if (count <= 0) return "bg-[#1d1d1d]";
  if (count <= 2) return "bg-emerald-950";
  if (count <= 4) return "bg-emerald-700/70";
  return "bg-emerald-500";
}

export function sameDay(left: string, right: string) {
  return isSameDay(parseISO(left), parseISO(right));
}
