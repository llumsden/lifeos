"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useUIStore } from "@/hooks/use-ui-store";
import { NAV_ITEMS } from "@/lib/constants";
import { cn, formatDateLabel } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/6 bg-white/80 px-4 py-3 backdrop-blur dark:bg-[#0f0f0f]/90 lg:hidden">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Life OS
          </p>
          <p className="text-sm text-white">{formatDateLabel(new Date(), "EEE, d MMM")}</p>
        </div>
        <Button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          variant="outline"
          size="icon"
        >
          <Menu className="size-4" />
        </Button>
      </div>

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="ml-auto flex h-full w-72 flex-col border-l border-white/10 bg-white p-5 dark:bg-[#101010]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    Navigate
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Life OS</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <nav className="mt-8 space-y-2">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-sm",
                        active
                          ? "bg-indigo-500/15 text-white"
                          : "text-muted-foreground hover:bg-white/[0.03] hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6">
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
