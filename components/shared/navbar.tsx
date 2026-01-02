"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  subRoutes?: {
    label: string;
    href: string;
  }[];
}

const navItems: NavItem[] = [
  {
    label: "المبيعات",
    href: "/sales/daily-follow-up",
    subRoutes: [
      { label: "المتابعة اليومية", href: "/sales/daily-follow-up" },
      { label: "الزيارات اليومية", href: "/sales/daily-visits" },
      { label: "الحركة اليومية", href: "/sales/daily-movement" },
      { label: "الشركات المعتمدة", href: "/sales/companies" },
      { label: "المقاطع", href: "/sales/sections" },
    ],
  },
  {
    label: "المشاريع",
    href: "/projects/descriptions",
    subRoutes: [
      { label: "الوصوف", href: "/projects/descriptions" },
      { label: "قائمة العقود", href: "/projects/contracts" },
      { label: "طلبات الانتاج", href: "/projects/production-orders" },
    ],
  },
  {
    label: "القياسات",
    href: "/measurements/orders",
  },
  {
    label: "القسم المالي",
    href: "/financial/debts",
  },
  {
    label: "إدارة المهام",
    href: "/tasks-manager/all-tasks",
  },
];

export const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isMainItemActive = (item: NavItem) => {
    // Check if main item is active by checking if any of its sub-routes are active
    if (item.subRoutes) {
      return item.subRoutes.some((subRoute) => isActiveRoute(subRoute.href));
    }
    return isActiveRoute(item.href);
  };

  return (
    <div
      className="absolute left-0 top-0 p-3 z-10"
      style={{ width: "calc(100vw - 100px)", direction: "ltr" }}
    >
      <div className="h-full w-full p-3 rounded-full flex gap-4 items-center justify-between bg-white/30 dark:bg-[#0C111D4D]">
        <Logo variant="vertical" />
        <ul className="flex items-center gap-2 text-sm relative" dir="rtl">
          {navItems.map((item) => (
            <li key={item.label} className="relative">
              <div
                className="relative group"
                onMouseEnter={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  if (item.subRoutes) {
                    setHoveredItem(item.label);
                  }
                }}
                onMouseLeave={() => {
                  timeoutRef.current = setTimeout(() => {
                    setHoveredItem(null);
                  }, 100);
                }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "block px-4 py-2 rounded-full transition-colors cursor-pointer",
                    isMainItemActive(item)
                      ? "bg-white/60 dark:bg-white/10 text-brand-primary font-medium"
                      : "hover:bg-white/20 dark:hover:bg-white/10"
                  )}
                >
                  {item.label}
                </Link>
                {item.subRoutes && hoveredItem === item.label && (
                  <div
                    className="absolute top-full right-0 w-48 z-50"
                    onMouseEnter={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }
                      setHoveredItem(item.label);
                    }}
                    onMouseLeave={() => {
                      timeoutRef.current = setTimeout(() => {
                        setHoveredItem(null);
                      }, 100);
                    }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 shadow-lg py-1 min-w-max">
                      {item.subRoutes.map((subRoute) => (
                        <Link
                          key={subRoute.href}
                          href={subRoute.href}
                          className={cn(
                            "block px-4 py-2 text-sm transition-colors whitespace-nowrap",
                            isActiveRoute(subRoute.href)
                              ? "bg-gray-200 dark:bg-gray-800 text-brand-primary font-medium"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                        >
                          {subRoute.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
