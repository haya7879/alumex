"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


export interface PageHeaderProps {
  title?: string;
  breadcrumb?: { label: string; href: string }[];
  className?: string;
}

export default function PageHeader({
  title,
  breadcrumb,
  className,
}: PageHeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumb from pathname if not provided
  const generateBreadcrumb = () => {
    if (breadcrumb) return breadcrumb;

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbItems: { label: string; href: string }[] = [];

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbItems.push({ label, href });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumb();

  // Get page title from breadcrumb or use provided title
  const pageTitle =
    title || breadcrumbItems[breadcrumbItems.length - 1]?.label || "Page";
  return (
    <div
      className={cn(
        "flex items-center justify-between bg-white pb-4 rounded-lg",
        className
      )}
    >
      <div className="flex-1">
        {/* Page Title */}
        {/* <h1 className="font-bold text-gray-900 mb-2 text-sm">{pageTitle}</h1> */}
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index !== breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
