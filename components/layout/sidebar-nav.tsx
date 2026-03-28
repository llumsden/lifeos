"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  CalendarCheck2,
  CircleDollarSign,
  LayoutDashboard,
  NotebookPen,
  PanelLeftClose,
} from "lucide-react";

import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  "/dashboard": LayoutDashboard,
  "/study": BookOpen,
  "/training": Activity,
  "/finance": CircleDollarSign,
  "/habits": CalendarCheck2,
  "/review": NotebookPen,
};

interface SidebarNavProps {
  userEmail?: string | null;
}

export function SidebarNav({ userEmail }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-white/6 bg-[#0f0f0f]/90 px-5 py-6 backdrop-blur lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-200">
          <PanelLeftClose className="size-5" />
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Life OS
          </p>
          <h2 className="text-lg font-semibold text-white">Command centre</h2>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.href as keyof typeof iconMap];
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                active
                  ? "bg-indigo-500/15 text-white"
                  : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Session
        </p>
        <p className="mt-2 truncate text-sm text-white">{userEmail ?? "Signed in"}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Premium focus, low noise, clean reps.
        </p>
      </div>
    </aside>
  );
}
