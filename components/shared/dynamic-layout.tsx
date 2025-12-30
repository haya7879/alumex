"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeaderLink {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface DynamicLayoutProps {
  children: ReactNode;
  pathLabels?: Record<string, string>;
  headerLinks?: HeaderLink[];
  defaultTitle?: string;
  className?: string;
}

export default function DynamicLayout({
  children,
  pathLabels,
  headerLinks,
  defaultTitle,
  className,
}: DynamicLayoutProps) {
  const pathname = usePathname();

  // Generate breadcrumb dynamically based on current path
  const breadcrumb = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbItems: { label: string; href: string }[] = [];

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = pathLabels?.[segment] || segment;
      breadcrumbItems.push({ label, href });
    });

    return breadcrumbItems;
  }, [pathname, pathLabels]);

  // Get page title based on current path
  const pageTitle = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return pathLabels?.[lastSegment] || defaultTitle;
  }, [pathname, pathLabels, defaultTitle]);

  const headerLinksComponent = (
    <ContainerHeaderList>
      {headerLinks?.map((link, index) => (
        <ContainerHeaderLink
          key={index}
          label={link.label}
          href={link.href}
          Icon={link.icon}
          exact={link.exact}
        />
      ))}
    </ContainerHeaderList>
  );

  const pageHeaderComponent = (
    <PageHeader title={pageTitle} breadcrumb={breadcrumb} />
  );

  return (
    <div className={cn("rounded-lg mr-[90px]", className)}>
      {headerLinksComponent}
      <ContainerContent>
        {pageHeaderComponent}
        {children}
      </ContainerContent>
    </div>
  );
}

