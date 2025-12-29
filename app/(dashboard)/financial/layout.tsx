"use client";

import DynamicLayout from "@/components/shared/dynamic-layout";
import { Calendar } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { HeaderLink } from "@/components/shared/dynamic-layout";

// Map path segments to Arabic labels
const pathLabels: Record<string, string> = {
  financial: "المالية",
  debts: "المستحقات",
};

// Map routes to their header links
const routeHeaderLinks: Record<string, HeaderLink[]> = {
  debts: [
    {
      label: "المستحقات",
      href: "/financial/debts",
      icon: Calendar,
      exact: true,
    },
  ],
};

// Map routes to their default titles
const routeDefaultTitles: Record<string, string> = {
  debts: "المستحقات",
};

export default function FinancialLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Get the current route segment (the part after /financial/)
  const currentRoute = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const financialIndex = segments.indexOf("financial");
    if (financialIndex !== -1 && segments.length > financialIndex + 1) {
      return segments[financialIndex + 1];
    }
    return null;
  }, [pathname]);

  // Get header links for current route
  const headerLinks = useMemo(() => {
    if (!currentRoute) return [];
    return routeHeaderLinks[currentRoute] || [];
  }, [currentRoute]);

  // Get default title for current route
  const defaultTitle = useMemo(() => {
    if (!currentRoute) return "المالية";
    return routeDefaultTitles[currentRoute] || "المالية";
  }, [currentRoute]);

  return (
    <DynamicLayout
      pathLabels={pathLabels}
      headerLinks={headerLinks}
      defaultTitle={defaultTitle}
      className="mr-[90px]"
      layoutVariant="links-first"
    >
      {children}
    </DynamicLayout>
  );
}

