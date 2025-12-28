"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { Calendar, FileCheck, FileX, Plus } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";

// Map path segments to Arabic labels
const pathLabels: Record<string, string> = {
  sales: "المبيعات",
  "daily-follow-up": "المتابعة اليومية",
  "signed-contracts": "العقود الموقعة",
  "rejected-forms": "النماذج المرفوضة",
  "add-new-form": "إضافة نموذج جديد",
};

export default function DailyFollowUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Generate breadcrumb dynamically based on current path
  const breadcrumb = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbItems: { label: string; href: string }[] = [];

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = pathLabels[segment] || segment;
      breadcrumbItems.push({ label, href });
    });

    return breadcrumbItems;
  }, [pathname]);

  // Get page title based on current path
  const pageTitle = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return pathLabels[lastSegment] || "المتابعة اليومية";
  }, [pathname]);

  const headerLinks = [
    {
      label: "إضافة نموذج جديد",
      href: "/sales/daily-follow-up/add-new-form",
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
  ];
  return (
    <>
      <div className="rounded-lg mr-[90px]">
        <ContainerHeaderList>
          {headerLinks.map((link, index) => (
            <ContainerHeaderLink
              key={index}
              label={link.label}
              href={link.href}
              Icon={link.icon}
              exact={link.exact}
            />
          ))}
        </ContainerHeaderList>
        <ContainerContent>{children}</ContainerContent>
      </div>
    </>
  );
}
