import * as React from "react";

import { cn } from "@/lib/utils";

export type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function NativeSelect({ className, ...props }: NativeSelectProps) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-xl border border-input bg-black/20 px-3 py-2 text-sm text-foreground outline-none transition focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
