import { redirect } from "next/navigation";

import { AuthPanel } from "@/components/forms/auth-panel";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type AuthPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getSearchParam(
  value: string | string[] | undefined
) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  const errorCode = getSearchParam(searchParams?.error_code);
  const errorDescription = getSearchParam(searchParams?.error_description);

  return (
    <AuthPanel
      authErrorCode={errorCode}
      authErrorMessage={errorDescription}
    />
  );
}
