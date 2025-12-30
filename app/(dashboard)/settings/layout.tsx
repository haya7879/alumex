"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ContainerContent } from "@/components/shared/container";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "إعدادات الحساب",
      href: "/settings/account",
    },
    {
      label: "الصلاحيات والأذونات",
      href: "/settings/roles",
    },
  ];

  return (
    <div className="rounded-lg mr-[90px]">
      <ContainerContent className="rounded-2xl!">
        <div className="min-h-screen mt-5 flex items-start justify-between gap-10">
          <div className="max-w-[200px] w-full border-l pl-4">
            <ul className="flex flex-col gap-1 w-full text-sm">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-2 px-3 rounded-md transition-colors",
                        isActive
                          ? "bg-brand-primary dark:text-white text-gray-600 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </ContainerContent>
    </div>
  );
}
