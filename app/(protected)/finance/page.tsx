import { FinanceClient } from "./page-client";

import { getFinancePageData } from "@/lib/server-data";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const initialData = await getFinancePageData(supabase, user.id);

  return <FinanceClient userId={user.id} initialData={initialData} />;
}
