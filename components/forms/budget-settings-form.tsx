"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const budgetSchema = z.object({
  weekly_budget_limit: z.coerce.number().min(0),
});

export type BudgetSettingsValues = z.infer<typeof budgetSchema>;
type BudgetSettingsInput = z.input<typeof budgetSchema>;

interface BudgetSettingsFormProps {
  defaultValues: BudgetSettingsValues;
  onSubmit: (values: BudgetSettingsValues) => Promise<void> | void;
}

export function BudgetSettingsForm({
  defaultValues,
  onSubmit,
}: BudgetSettingsFormProps) {
  const form = useForm<BudgetSettingsInput, unknown, BudgetSettingsValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: defaultValues as BudgetSettingsInput,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="weekly_budget_limit">Weekly budget limit</Label>
        <Input
          id="weekly_budget_limit"
          type="number"
          min={0}
          step="0.01"
          {...form.register("weekly_budget_limit")}
        />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save budget"}
      </Button>
    </form>
  );
}
