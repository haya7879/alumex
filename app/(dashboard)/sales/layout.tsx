"use client";

import DynamicLayout from "@/components/shared/dynamic-layout";
import { Calendar, FileCheck, FileX, Plus, FolderKanban } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { HeaderLink } from "@/components/shared/dynamic-layout";

// Map path segments to Arabic labels
const pathLabels: Record<string, string> = {
  sales: "المبيعات",
  "daily-follow-up": "المتابعة اليومية",
  "rejected-forms": "النماذج المرفوضة",
  "signed-contracts": "العقود الموقعة",
  "daily-movement": "الحركة اليومية",
  "daily-visits": "الزيارات اليومية",
  companies: "الشركات المعتمدة",
  "section-options": "خيارات المقاطع",
  create: "إضافة",
};

// Map routes to their header links
const routeHeaderLinks: Record<string, HeaderLink[]> = {
  "daily-follow-up": [
    {
      label: "إضافة نموذج",
      href: "/sales/daily-follow-up/create",
      icon: Plus,
    },
    {
      label: "النماذج المرفوضة",
      href: "/sales/daily-follow-up/rejected-forms",
      icon: FileX,
    },
    {
      label: "العقود الموقعة",
      href: "/sales/daily-follow-up/signed-contracts",
      icon: FileCheck,
    },
    {
      label: "برنامج المتابعة اليومي",
      href: "/sales/daily-follow-up",
      icon: Calendar,
      exact: true,
    },
  ],
  "daily-movement": [
    {
      label: "إضافة حركة",
      href: "/sales/daily-movement/create",
      icon: Plus,
    },
    {
      label: "الحركة اليومية",
      href: "/sales/daily-movement",
      icon: Calendar,
      exact: true,
    },
  ],
  "daily-visits": [
    {
      label: "إضافة زيارة",
      href: "/sales/daily-visits/create",
      icon: Plus,
    },
    {
      label: "جدول الزيارات اليومية",
      href: "/sales/daily-visits",
      icon: Calendar,
      exact: true,
    },
  ],
  companies: [
    {
      label: "إضافة شركة",
      href: "/sales/companies/create",
      icon: Plus,
    },
    {
      label: "جدول الشركات",
      href: "/sales/companies",
      icon: Calendar,
      exact: true,
    },
  ],
  "section-options": [
    {
      label: "إضافة مقطع",
      href: "/sales/section-options/create",
      icon: Plus,
    },
    {
      label: "المقاطع المتاحة",
      href: "/sales/section-options",
      icon: FolderKanban,
      exact: true,
    },
  ],
};

// Map routes to their default titles
const routeDefaultTitles: Record<string, string> = {
  "daily-follow-up": "المتابعة اليومية",
  "daily-movement": "الحركة اليومية",
  "daily-visits": "الزيارات اليومية",
  companies: "الشركات المعتمدة",
  "section-options": "خيارات المقاطع",
};

export default function SalesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Get the current route segment (the part after /sales/)
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
      className="mr-[90px]"
      layoutVariant="links-first"
    >
      {children}
    </DynamicLayout>
  );
}

