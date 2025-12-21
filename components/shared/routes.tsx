"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NAVITEMS } from "@/constants";
import { SalesPopover } from "./sales-popover";

export const Routes = () => {
  const pathname = usePathname();
  const [showSalesMenu, setShowSalesMenu] = useState(false);

  return (
    <div className="flex items-center gap-1 relative">
      {NAVITEMS.map((item, idx) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname?.startsWith(item.href));
        const isSales = item.label === "Sales";

        if (isSales) {
          return (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => setShowSalesMenu(true)}
              onMouseLeave={() => setShowSalesMenu(false)}
            >
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-base font-medium transition-colors",
                  isActive
                    ? "bg-white text-black"
                    : "text-black/80 hover:text-black hover:bg-white/50"
                )}
              >
                {item.label}
              </Link>
              <SalesPopover
                showSalesMenu={showSalesMenu}
                setShowSalesMenu={setShowSalesMenu}
                onMouseEnter={() => setShowSalesMenu(true)}
                onMouseLeave={() => setShowSalesMenu(false)}
                onClick={() => setShowSalesMenu(false)}
              />
            </div>
          );
        }

        return (
          <Link
            key={idx}
            href={item.href}
            className={cn(
              "px-4 py-2 rounded-full text-base font-medium transition-colors",
              isActive
                ? "bg-white text-black"
                : "text-black/80 hover:text-black hover:bg-white/50"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};
