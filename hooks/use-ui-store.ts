"use client";

import { create } from "zustand";

interface UIState {
  mobileNavOpen: boolean;
  activeQuoteIndex: number;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setActiveQuoteIndex: (index: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  activeQuoteIndex: 0,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  toggleMobileNav: () =>
    set((state) => ({
      mobileNavOpen: !state.mobileNavOpen,
    })),
  setActiveQuoteIndex: (activeQuoteIndex) => set({ activeQuoteIndex }),
}));
