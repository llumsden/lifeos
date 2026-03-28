"use client";

import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";
import { MonthlyExpenseChart } from "@/components/charts/monthly-expense-chart";
import { BudgetSettingsForm } from "@/components/forms/budget-settings-form";
import { ExpenseForm } from "@/components/forms/expense-form";
import { IncomeEntryForm } from "@/components/forms/income-entry-form";
import { TutoringSessionForm } from "@/components/forms/tutoring-session-form";
import { PageHeader } from "@/components/layout/page-header";
import { RealtimeQuerySync } from "@/components/providers/realtime-query-sync";
import { Progress } from "@/components/ui/progress";
import {
  useFinanceData,
  useSaveExpense,
  useSaveIncomeEntry,
  useSaveTutoringSession,
  useUpdateProfile,
} from "@/lib/queries";
import {
  formatCurrency,
  formatDateLabel,
  getRunningBalance,
  getWeeklyExpenseTotal,
} from "@/lib/utils";
import type { FinancePageData } from "@/types";

interface FinanceClientProps {
  userId: string;
  initialData: FinancePageData;
}

export function FinanceClient({ userId, initialData }: FinanceClientProps) {
  const { data } = useFinanceData(userId, initialData);
  const finance = data ?? initialData;
  const saveExpense = useSaveExpense(userId);
  const saveIncome = useSaveIncomeEntry(userId);
  const saveTutoring = useSaveTutoringSession(userId);
  const updateProfile = useUpdateProfile(userId);

  const weeklyBudget = finance.profile?.weekly_budget_limit ?? 200;
  const weeklySpend = getWeeklyExpenseTotal(finance.expenses);
  const runningBalance = getRunningBalance(
    finance.expenses,
    finance.incomeEntries,
    finance.tutoringSessions
  );
  const tutoringOutstanding = finance.tutoringSessions
    .filter((session) => !session.paid)
    .reduce((sum, session) => {
      const rate = Number(session.rate_per_hour ?? 0);
      const duration = Number(session.duration_minutes ?? 0);
      return sum + (duration / 60) * rate;
    }, 0);
  const weeklyPercent =
    weeklyBudget <= 0 ? 0 : Math.min((weeklySpend / weeklyBudget) * 100, 100);

  return (
    <div className="space-y-8">
      <RealtimeQuerySync
        userId={userId}
        tables={["expenses", "income_entries", "tutoring_sessions", "user_profiles"]}
        queryKeys={[["finance", userId], ["dashboard", userId]]}
      />

      <PageHeader
        eyebrow="Finance"
        title="Keep the spend tight and the cash flow visible."
        description="Weekly non-essential budget tracking, expense logging, manual income, and tutoring payment status in one place."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Weekly budget"
          value={formatCurrency(weeklyBudget)}
          caption="Current non-essential budget cap."
          accent="warning"
        />
        <StatCard
          label="Spent this week"
          value={formatCurrency(weeklySpend)}
          caption={weeklySpend > weeklyBudget ? "Over budget this week." : "Still inside the line."}
          accent={weeklySpend > weeklyBudget ? "warning" : "success"}
        />
        <StatCard
          label="Running balance"
          value={formatCurrency(runningBalance)}
          caption="Income entries + paid tutoring - expenses."
          accent="primary"
        />
        <StatCard
          label="Outstanding tutoring"
          value={formatCurrency(tutoringOutstanding)}
          caption="Sessions logged as unpaid."
          accent="neutral"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
        <SectionCard
          title="Weekly budget tracker"
          description="Set the cap and watch this week's spend against it."
        >
          <BudgetSettingsForm
            defaultValues={{ weekly_budget_limit: weeklyBudget }}
            onSubmit={async (values) => {
              await updateProfile.mutateAsync(values);
            }}
          />

          <div className="space-y-3 rounded-3xl border border-white/6 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Weekly usage</span>
              <span className="mono-numeric text-white">
                {formatCurrency(weeklySpend)} / {formatCurrency(weeklyBudget)}
              </span>
            </div>
            <Progress
              value={weeklyPercent}
              className={`h-3 bg-white/5 ${weeklySpend > weeklyBudget ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Monthly overview"
          description="Recent monthly expense totals styled for the dark theme."
        >
          <MonthlyExpenseChart expenses={finance.expenses} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Expense log" description="Food, transport, gear, supplements, and everything else.">
          <ExpenseForm
            defaultValues={{
              date: finance.today,
              amount: 0,
              category: "Food",
              note: "",
            }}
            onSubmit={async (values) => {
              await saveExpense.mutateAsync(values);
            }}
          />
        </SectionCard>

        <SectionCard title="Manual income" description="Track tutoring, reimbursements, or any other money in.">
          <IncomeEntryForm
            defaultValues={{
              date: finance.today,
              amount: 0,
              source: "Tutoring",
              note: "",
            }}
            onSubmit={async (values) => {
              await saveIncome.mutateAsync(values);
            }}
          />
        </SectionCard>

        <SectionCard title="Tutoring session tracker" description="Client, duration, rate, and payment state.">
          <TutoringSessionForm
            defaultValues={{
              date: finance.today,
              client_name: "",
              duration_minutes: 60,
              rate_per_hour: 60,
              paid: false,
              notes: "",
            }}
            onSubmit={async (values) => {
              await saveTutoring.mutateAsync(values);
            }}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <SectionCard
          title="Recent expenses"
          description="Newest expense entries first."
        >
          <div className="space-y-3">
            {finance.expenses.slice(0, 10).map((expense) => (
              <div
                key={expense.id}
                className="grid gap-2 rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4 md:grid-cols-[120px,1fr,120px]"
              >
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {formatDateLabel(expense.date, "d MMM")}
                </p>
                <div>
                  <p className="font-medium text-white">{expense.category}</p>
                  {expense.note ? (
                    <p className="mt-1 text-sm text-muted-foreground">{expense.note}</p>
                  ) : null}
                </div>
                <p className="mono-numeric text-right text-sm text-white">
                  {formatCurrency(Number(expense.amount))}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent tutoring sessions"
          description="Paid and unpaid tutoring entries at a glance."
        >
          <div className="space-y-3">
            {finance.tutoringSessions.slice(0, 10).map((session) => {
              const value =
                (Number(session.duration_minutes ?? 0) / 60) *
                Number(session.rate_per_hour ?? 0);

              return (
                <div
                  key={session.id}
                  className="grid gap-2 rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4 md:grid-cols-[120px,1fr,120px]"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {formatDateLabel(session.date, "d MMM")}
                  </p>
                  <div>
                    <p className="font-medium text-white">
                      {session.client_name ?? "Untitled client"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {session.duration_minutes} mins @ {formatCurrency(Number(session.rate_per_hour ?? 0))}/hr
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mono-numeric text-sm text-white">
                      {formatCurrency(value)}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {session.paid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
