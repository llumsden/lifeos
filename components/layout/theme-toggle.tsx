"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useUIStore } from "@/hooks/use-ui-store";

export function ThemeToggle() {
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {isDark ? (
        <SunMedium className="mr-2 size-4" />
      ) : (
        <MoonStar className="mr-2 size-4" />
      )}
      {isDark ? "Light mode" : "Dark mode"}
    </Button>
  );
}
