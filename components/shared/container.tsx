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

export function ContainerContent({ children, className }: ContainerProps) {
  const containerClasses = cn(
    "bg-white h-full flex flex-col rounded-tr-2xl rounded-b-2xl p-4",
    className
  );

  const contentClasses = cn("flex-1");

  return (
    <div className={containerClasses}>
      {/* Content Area */}
      <div className={contentClasses}>{children}</div>
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
    : normalizedPath === normalizedHref ||
      normalizedPath.startsWith(normalizedHref + "/");

  return (
    <Link
      href={href}
      data-active={isActive}
      className={cn(
        "text-sm font-medium px-6 py-3 relative flex items-center gap-2 rounded-t-lg transition-all cursor-pointer",
        "before:absolute before:bottom-0 before:-left-6 before:h-11 before:w-6 before:bg-[url('/carved-left.svg')] before:bg-contain before:bg-bottom before:bg-no-repeat before:content-[''] before:opacity-0 before:transition-opacity",
        "after:absolute after:-bottom-0 after:-right-6 after:h-11 after:w-6 after:bg-[url('/carved-right.svg')] after:bg-contain after:bg-bottom after:bg-no-repeat afte:content-[''] after:opacity-0 after:transition-opacity",
        isActive
          ? "bg-background text-brand-primary before:opacity-100 after:opacity-100"
          : "hover:text-brand-primary hover:before:opacity-100 hover:after:opacity-100 hover:bg-background"
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="sr-only xl:not-sr-only">{label}</span>
    </Link>
  );
}

export function ContainerHeaderList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 overflow-hidden justify-end">
      {children}
    </div>
  );
}
