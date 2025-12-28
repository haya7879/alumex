"use client";

import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className={cn(
        "w-full h-full transition-all duration-300 p-4 pt-4 mt-[60px]",
        isOpen ? "mr-[85px]" : "mr-0"
      )}
      style={{ width: "calc(100vw - 100px)" }}
    >
      {children}
    </div>
  );
}
