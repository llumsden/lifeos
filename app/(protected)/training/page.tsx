import { TrainingClient } from "./page-client";

import { getTrainingPageData } from "@/lib/server-data";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const initialData = await getTrainingPageData(supabase, user.id);

  return <TrainingClient userId={user.id} initialData={initialData} />;
}
