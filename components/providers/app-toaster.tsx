"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        className:
          "border border-white/10 bg-[#141414] text-white shadow-2xl shadow-black/40",
      }}
    />
  );
}
