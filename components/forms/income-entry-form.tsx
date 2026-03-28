"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { incomeSchema, type IncomeValues } from "@/lib/validators";

interface IncomeEntryFormProps {
  defaultValues: IncomeValues;
  onSubmit: (values: IncomeValues) => Promise<void> | void;
}

type IncomeInput = z.input<typeof incomeSchema>;

export function IncomeEntryForm({
  defaultValues,
  onSubmit,
}: IncomeEntryFormProps) {
  const form = useForm<IncomeInput, unknown, IncomeValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: defaultValues as IncomeInput,
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
          <Label htmlFor="income-date">Date</Label>
          <Input id="income-date" type="date" {...form.register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="income-amount">Amount</Label>
          <Input
            id="income-amount"
            type="number"
            min={0}
            step="0.01"
            {...form.register("amount")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="income-source">Source</Label>
          <Input id="income-source" {...form.register("source")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="income-note">Note</Label>
        <Textarea id="income-note" rows={3} {...form.register("note")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save income"}
      </Button>
    </form>
  );
}
