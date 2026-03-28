"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeMode = "dark" | "light";

interface UIState {
  mobileNavOpen: boolean;
  activeQuoteIndex: number;
  theme: ThemeMode;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setActiveQuoteIndex: (index: number) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      mobileNavOpen: false,
      activeQuoteIndex: 0,
      theme: "dark",
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      toggleMobileNav: () =>
        set((state) => ({
          mobileNavOpen: !state.mobileNavOpen,
        })),
      setActiveQuoteIndex: (activeQuoteIndex) => set({ activeQuoteIndex }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "life-ui-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
