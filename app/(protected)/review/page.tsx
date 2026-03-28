import { ReviewClient } from "./page-client";

import { getReviewPageData } from "@/lib/server-data";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const initialData = await getReviewPageData(supabase, user.id);

  return <ReviewClient userId={user.id} initialData={initialData} />;
}
