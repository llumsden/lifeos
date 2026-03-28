"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LogIn, MailCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase";
import {
  authPasswordSchema,
  magicLinkSchema,
  type AuthPasswordValues,
  type MagicLinkValues,
} from "@/lib/validators";

export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");

  const passwordForm = useForm<AuthPasswordValues>({
    resolver: zodResolver(authPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const magicLinkForm = useForm<MagicLinkValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmitPassword = passwordForm.handleSubmit(async (values) => {
    if (!isSupabaseConfigured()) {
      toast.error("Add Supabase environment variables before signing in.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const authMethod =
      mode === "sign_in"
        ? supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          })
        : supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

    const { error } = await authMethod;

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      mode === "sign_in"
        ? "Signed in. Loading your dashboard..."
        : "Account created. Check your email if confirmation is enabled."
    );
    router.push("/dashboard");
    router.refresh();
  });

  const onSubmitMagicLink = magicLinkForm.handleSubmit(async (values) => {
    if (!isSupabaseConfigured()) {
      toast.error("Add Supabase environment variables before using magic links.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Magic link sent. Check your inbox.");
    magicLinkForm.reset();
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-white/6 bg-white/[0.03] p-8 shadow-soft"
      >
        <div className="mb-8 space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.34em] text-indigo-200/80">
            Personal operating system
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Sign in to your command centre
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Study, training, habits, finances, and your weekly review flow in one
            calm place.
          </p>
        </div>

        <div className="mb-6 inline-flex rounded-full border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            onClick={() => setMode("sign_in")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              mode === "sign_in"
                ? "bg-indigo-500 text-white"
                : "text-muted-foreground"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("sign_up")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              mode === "sign_up"
                ? "bg-indigo-500 text-white"
                : "text-muted-foreground"
            }`}
          >
            Create account
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmitPassword}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...passwordForm.register("email")} />
            {passwordForm.formState.errors.email ? (
              <p className="text-sm text-red-400">
                {passwordForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...passwordForm.register("password")}
            />
            {passwordForm.formState.errors.password ? (
              <p className="text-sm text-red-400">
                {passwordForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={passwordForm.formState.isSubmitting}
          >
            <LogIn className="mr-2 size-4" />
            {passwordForm.formState.isSubmitting
              ? "Working..."
              : mode === "sign_in"
                ? "Sign in"
                : "Create account"}
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-[28px] border border-white/6 bg-gradient-to-br from-indigo-500/18 via-white/[0.03] to-transparent p-8 shadow-soft"
      >
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 p-3 text-indigo-200">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Magic link access</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Prefer low-friction auth? Send yourself a magic link and step
              straight into the app.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmitMagicLink}>
          <div className="space-y-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input
              id="magic-email"
              type="email"
              {...magicLinkForm.register("email")}
            />
            {magicLinkForm.formState.errors.email ? (
              <p className="text-sm text-red-400">
                {magicLinkForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            variant="outline"
            className="w-full border-indigo-400/20 bg-indigo-500/10 text-indigo-100 hover:bg-indigo-500/20"
            disabled={magicLinkForm.formState.isSubmitting}
          >
            <MailCheck className="mr-2 size-4" />
            {magicLinkForm.formState.isSubmitting ? "Sending..." : "Send magic link"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
