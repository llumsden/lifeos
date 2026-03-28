import { SundayReviewPrompt } from "@/components/providers/sunday-review-prompt";

import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./sidebar-nav";

interface AppShellProps {
  userId: string;
  userEmail?: string | null;
  showSundayReviewPrompt?: boolean;
  children: React.ReactNode;
}

export function AppShell({
  userId,
  userEmail,
  showSundayReviewPrompt = true,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <SidebarNav userEmail={userEmail} />
        <div className="flex min-h-screen flex-1 flex-col">
          <MobileNav />
          <div className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 page-grid opacity-50" />
            <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8">
              {children}
            </div>
          </div>
        </div>
      </div>
      {showSundayReviewPrompt ? <SundayReviewPrompt userId={userId} /> : null}
    </div>
  );
}
