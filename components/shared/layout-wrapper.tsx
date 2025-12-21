"use client";

import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className={cn(
        "w-full h-full transition-all duration-300 p-4 pt-4",
        isOpen ? "mr-[230px]" : "mr-0"
      )}
    >
      {children}
    </div>
  );
}

