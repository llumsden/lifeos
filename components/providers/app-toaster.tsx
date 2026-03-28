"use client";

import { Toaster } from "sonner";
import { useUIStore } from "@/hooks/use-ui-store";

export function AppToaster() {
  const theme = useUIStore((state) => state.theme);

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
      toastOptions={{
        className:
          "border border-white/10 bg-popover text-foreground shadow-2xl shadow-black/10 dark:shadow-black/40",
      }}
    />
  );
}
