"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { expenseSchema, type ExpenseValues } from "@/lib/validators";

interface ExpenseFormProps {
  defaultValues: ExpenseValues;
  onSubmit: (values: ExpenseValues) => Promise<void> | void;
}

type ExpenseInput = z.input<typeof expenseSchema>;

export function ExpenseForm({ defaultValues, onSubmit }: ExpenseFormProps) {
  const form = useForm<ExpenseInput, unknown, ExpenseValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultValues as ExpenseInput,
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
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="expense-date">Date</Label>
          <Input id="expense-date" type="date" {...form.register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-amount">Amount</Label>
          <Input
            id="expense-amount"
            type="number"
            step="0.01"
            min={0}
            {...form.register("amount")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-category">Category</Label>
          <NativeSelect
            id="expense-category"
            {...form.register("category")}
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-note">Note</Label>
        <Textarea id="expense-note" rows={3} {...form.register("note")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save expense"}
      </Button>
    </form>
  );
}
