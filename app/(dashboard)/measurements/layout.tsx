"use client";

import DynamicLayout from "@/components/shared/dynamic-layout";
import { Archive, ShoppingCart } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { HeaderLink } from "@/components/shared/dynamic-layout";

// Map path segments to Arabic labels
const pathLabels: Record<string, string> = {
  measurements: "القياسات",
  orders: "الطلبات",
  archive: "الأرشيف",
};

// Map routes to their header links
const routeHeaderLinks: Record<string, HeaderLink[]> = {
  orders: [
    {
      label: "الأرشيف",
      href: "/measurements/orders/archive",
      icon: Archive,
    },
    {
      label: "عرض الطلبات",
      href: "/measurements/orders",
      icon: ShoppingCart,
      exact: true,
    },
  ],
};

// Map routes to their default titles
const routeDefaultTitles: Record<string, string> = {
  orders: "الطلبات",
};

export default function MeasurementsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Get the current route segment (the part after /measurements/)
  const currentRoute = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const measurementsIndex = segments.indexOf("measurements");
    if (measurementsIndex !== -1 && segments.length > measurementsIndex + 1) {
      return segments[measurementsIndex + 1];
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
    if (!currentRoute) return "القياسات";
    return routeDefaultTitles[currentRoute] || "القياسات";
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
