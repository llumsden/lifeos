import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
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

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  await ensureUserBootstrap(supabase, user.id);

  return (
    <AppShell userId={user.id} userEmail={user.email}>
      {children}
    </AppShell>
  );
}
