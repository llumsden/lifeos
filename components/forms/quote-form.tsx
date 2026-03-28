"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { quoteSchema, type QuoteValues } from "@/lib/validators";

interface QuoteFormProps {
  defaultValues: QuoteValues & { position: number };
  onSubmit: (values: QuoteValues & { position: number }) => Promise<void> | void;
  submitLabel?: string;
}

const quoteFormSchema = quoteSchema.extend({
  position: z.coerce.number().int().min(1),
});
type QuoteFormInput = z.input<typeof quoteFormSchema>;

export function QuoteForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save quote",
}: QuoteFormProps) {
  const form = useForm<QuoteFormInput, unknown, QuoteValues & { position: number }>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: defaultValues as QuoteFormInput,
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
      <input type="hidden" {...form.register("position", { valueAsNumber: true })} />

      <div className="space-y-2">
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" rows={4} {...form.register("quote")} />
        {form.formState.errors.quote ? (
          <p className="text-sm text-red-400">{form.formState.errors.quote.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" {...form.register("author")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
