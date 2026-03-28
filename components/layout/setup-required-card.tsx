import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SetupRequiredCardProps {
  title?: string;
  message?: string;
}

export function SetupRequiredCard({
  title = "Finish Supabase setup",
  message = "The app can authenticate, but the protected dashboard data layer is not ready yet.",
}: SetupRequiredCardProps) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-8 shadow-soft">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-amber-200/80">
        Setup required
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-amber-50/80">
        {message}
      </p>

      <div className="mt-6 rounded-2xl border border-white/8 bg-black/20 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-white">Check these production steps:</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Run `supabase/migrations/001_init.sql` on the hosted Supabase project.</li>
          <li>Run `supabase/seed.sql` on the same project.</li>
          <li>
            Confirm Vercel is using the same `NEXT_PUBLIC_SUPABASE_URL` and
            `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
          </li>
          <li>Redeploy and sign in again.</li>
        </ol>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/auth"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Back to auth
        </Link>
      </div>
    </div>
  );
}
