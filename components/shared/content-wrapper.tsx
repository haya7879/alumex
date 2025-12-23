"use client";

import { useSidebarStore } from "@/store/use-sidebar-store";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();

  return (
    <div 
      className="w-full h-full transition-all p-4 pt-4" 
      style={{ width: isOpen ? "calc(100vw - 235px)" : "calc(100vw - 80px)" }}
    >
      {children}
    </div>
  );
}

