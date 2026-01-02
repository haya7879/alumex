"use client";

import DynamicLayout from "@/components/shared/dynamic-layout";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  pathLabels,
  routeDefaultTitles,
  routeHeaderLinks,
} from "@/app/(dashboard)/sales/_components/constants";

export default function SalesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const currentRoute = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const salesIndex = segments.indexOf("sales");
    if (salesIndex !== -1 && segments.length > salesIndex + 1) {
      return segments[salesIndex + 1];
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
    if (!currentRoute) return "المبيعات";
    return routeDefaultTitles[currentRoute] || "المبيعات";
  }, [currentRoute]);

  return (
    <DynamicLayout
      pathLabels={pathLabels}
      headerLinks={headerLinks}
      defaultTitle={defaultTitle}
    >
      {children}
    </DynamicLayout>
  );
}
