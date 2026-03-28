import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient, ensureUserBootstrap } from "@/lib/supabase-server";

type EmailOtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email"
  | "email_change";

const EMAIL_OTP_TYPES = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email",
  "email_change",
] as const satisfies readonly EmailOtpType[]);

function redirectToAuth(requestUrl: URL, params?: Record<string, string | undefined>) {
  const url = new URL("/auth", requestUrl);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const authError = requestUrl.searchParams.get("error");
  const authErrorCode = requestUrl.searchParams.get("error_code");
  const authErrorDescription = requestUrl.searchParams.get("error_description");

  if (!isSupabaseConfigured()) {
    return redirectToAuth(requestUrl);
  }

  if (authError || authErrorCode || authErrorDescription) {
    return redirectToAuth(requestUrl, {
      error: authError ?? undefined,
      error_code: authErrorCode ?? undefined,
      error_description: authErrorDescription ?? undefined,
    });
  }

  const supabase = await createSupabaseServerClient();
  let error: Error | null = null;

  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  } else if (tokenHash && type && EMAIL_OTP_TYPES.has(type as EmailOtpType)) {
    const result = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    error = result.error;
  } else {
    return redirectToAuth(requestUrl, {
      error_code: "missing_auth_token",
      error_description: "Email link is missing the token needed to complete sign-in.",
    });
  }

  if (error) {
    return redirectToAuth(requestUrl, {
      error_code: "auth_callback_error",
      error_description: error.message,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureUserBootstrap(supabase, user.id);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
