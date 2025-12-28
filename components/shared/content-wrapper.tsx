"use client";

import { cn } from "@/lib/utils";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "absolute left-0 w-full h-full transition-all duration-300 pt-4 mt-[60px] px-3"
      )}
    >
      {children}
    </div>
  );
}
