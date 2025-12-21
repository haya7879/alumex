"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Tabs, { TabItem } from "./tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";

export interface HeaderLink {
  label: string;
  href: string;
  icon?: React.ElementType;
  exact?: boolean;
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  tabs?: TabItem[];
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  headerLinks?: HeaderLink[];
  padding?: boolean | string;
  rounded?: boolean | string;
  shadow?: boolean | string;
}

export function ContainerContent({
  children,
  className,
}: ContainerProps) {

  const containerClasses = cn(
    "bg-white h-full flex flex-col rounded-tr-2xl rounded-b-2xl p-4",
    className
  );

  const contentClasses = cn(
    "flex-1"
  );

  return (
    <div className={containerClasses}>
      {/* Content Area */}
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  );
}


export function ContainerHeaderLink({
  label,
  href,
  Icon,
  exact = false,
  ...props
}: React.ComponentProps<"a"> & {
  label: string;
  href: string;
  Icon?: React.ElementType;
  exact?: boolean;
}) {
  const pathname = usePathname();

  const normalizedPath = pathname.replace(/^\/(en|ar)/, "");
  const normalizedHref = href.replace(/^\/(en|ar)/, "");

  // Check if this is an exact match or if we should check for path segments
  const isActive = exact
    ? normalizedPath === normalizedHref
    : normalizedPath === normalizedHref || normalizedPath.startsWith(normalizedHref + "/");

  return (
    <Link
      href={href}
      data-active={isActive}
      className={cn(
        "relative text-xs font-medium px-4 py-2.5 flex items-center gap-2 rounded-t-md transition-all cursor-pointer",
        isActive
          ? "bg-blue-50 text-gray-900 border-b-2 border-gray-900"
          : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </Link>
  );
}

export function ContainerHeaderList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 overflow-hidden px-4">
      {children}
    </div>
  );
}