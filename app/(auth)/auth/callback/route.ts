import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient, ensureUserBootstrap } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureUserBootstrap(supabase, user.id);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
