import { HabitsClient } from "./page-client";

import { getHabitsPageData } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const initialData = await getHabitsPageData(supabase, user.id);

  return <HabitsClient userId={user.id} initialData={initialData} />;
}
