import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { SetupRequiredCard } from "@/components/layout/setup-required-card";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient, ensureUserBootstrap } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/auth");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Failed to read authenticated user in protected layout.", error);
      redirect("/auth");
    }

    if (!user) {
      redirect("/auth");
    }

    await ensureUserBootstrap(supabase, user.id);

    return (
      <AppShell userId={user.id} userEmail={user.email}>
        {children}
      </AppShell>
    );
  } catch (error) {
    console.error("Protected app shell failed to initialize.", error);

    return (
      <AppShell
        userId="setup-required"
        userEmail={null}
        showSundayReviewPrompt={false}
      >
        <SetupRequiredCard />
      </AppShell>
    );
  }
}
