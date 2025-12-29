"use client";

import DynamicLayout from "@/components/shared/dynamic-layout";
import { Archive, FileText, List, Plus } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { HeaderLink } from "@/components/shared/dynamic-layout";

// Map path segments to Arabic labels
const pathLabels: Record<string, string> = {
  projects: "المشاريع",
  descriptions: "الوصوف",
  contracts: "قائمة العقود",
  "production-orders": "طلبات الانتاج",
  "order-details": "طلبات التفصيلي",
  create: "إضافة",
};

// Map routes to their header links
const routeHeaderLinks: Record<string, HeaderLink[]> = {
  descriptions: [
    {
      label: "إضافة وصف",
      href: "/projects/descriptions/create",
      icon: Plus,
    },
    {
      label: "عرض الوصوف",
      href: "/projects/descriptions",
      icon: List,
      exact: true,
    }
  ],
  contracts: [
    {
      label: "طلبات التفصيلي",
      href: "/projects/contracts/order-details",
      icon: FileText,
    },
    {
      label: "قائمة العقود",
      href: "/projects/contracts",
      icon: FileText,
      exact: true,
    },
  ],
  "production-orders": [
    {
      label: "طلبات الانتاج",
      href: "/projects/production-orders",
      icon: List,
      exact: true,
    },
  ],
};

// Map routes to their default titles
const routeDefaultTitles: Record<string, string> = {
  descriptions: "الوصوف",
  contracts: "قائمة العقود",
  "production-orders": "طلبات الانتاج",
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Get the current route segment (the part after /projects/)
  const currentRoute = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const projectsIndex = segments.indexOf("projects");
    if (projectsIndex !== -1 && segments.length > projectsIndex + 1) {
      return segments[projectsIndex + 1];
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
    if (!currentRoute) return "المشاريع";
    return routeDefaultTitles[currentRoute] || "المشاريع";
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
