import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function appendSearchParam(
  params: URLSearchParams,
  key: string,
  value: string | string[] | undefined
) {
  if (typeof value === "undefined") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => params.append(key, item));
    return;
  }

  params.set(key, value);
}

export default async function Home({ searchParams }: HomeProps) {
  if (
    searchParams?.error ||
    searchParams?.error_code ||
    searchParams?.error_description
  ) {
    const params = new URLSearchParams();

    appendSearchParam(params, "error", searchParams.error);
    appendSearchParam(params, "error_code", searchParams.error_code);
    appendSearchParam(params, "error_description", searchParams.error_description);

    const query = params.toString();
    redirect(query ? `/auth?${query}` : "/auth");
  }

  if (!isSupabaseConfigured()) {
    redirect("/auth");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/dashboard" : "/auth");
}
