"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { FolderKanban, Plus } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";

// Map path segments to Arabic labels
const pathLabels: Record<string, string> = {
  sales: "المبيعات",
  "section-options": "خيارات المقاطع",
  create: "إضافة مقطع",
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
    return pathLabels[lastSegment] || "خيارات المقاطع";
  }, [pathname]);

  const headerLinks = [
    {
      label: "المقاطع المتاحة",
      href: "/sales/section-options",
      icon: FolderKanban,
      exact: true,
    },
    {
      label: "إضافة مقطع",
      href: "/sales/section-options/create",
      icon: Plus,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title={pageTitle}
          breadcrumb={breadcrumb}
        />
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
