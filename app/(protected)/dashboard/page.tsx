import { DashboardClient } from "./page-client";

import { getDashboardPageData } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const initialData = await getDashboardPageData(supabase, user.id);

  return <DashboardClient userId={user.id} initialData={initialData} />;
}
