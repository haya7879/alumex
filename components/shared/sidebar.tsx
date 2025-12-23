"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  FolderKanban,
  Ruler,
  DollarSign,
  ClipboardList,
  LogOut,
  Moon,
  Sun,
  Home,
} from "lucide-react";
import { useModalStore, EModalType } from "@/store/use-modal-store";
import { LogoutModal } from "./logout-modal";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const Sidebar = () => {
  const { onOpen } = useModalStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Menu sections
  const menuSections: MenuSection[] = [
    {
      title: "قسم المبيعات",
      items: [
        {
          label: "المتابعة اليومية",
          href: "/sales/daily-follow-up",
          icon: ShoppingCart,
        },
        {
          label: "الزيارات اليومية",
          href: "/sales/daily-visits",
          icon: ShoppingCart,
        },
        {
          label: "الحركات اليومية",
          href: "/sales/daily-movements",
          icon: ShoppingCart,
        },
        {
          label: "خيارات المقاطع",
          href: "/sales/section-options",
          icon: ShoppingCart,
        },
        {
          label: "الشركات المعتمدة",
          href: "/sales/companies",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: "القسم المالي",
      items: [
        {
          label: "المستحقات",
          href: "/financial/debts",
          icon: DollarSign,
        },
      ],
    },
    {
      title: "قسم المشاريع",
      items: [
        {
          label: "قائمة العقود",
          href: "/projects/contracts",
          icon: FolderKanban,
        },
        {
          label: "الوصوف",
          href: "/projects/descriptions",
          icon: FolderKanban,
        },
        {
          label: "طلبات الانتاج",
          href: "/projects/production-orders",
          icon: FolderKanban,
        },
      ],
    },
    {
      title: "قسم القياسات",
      items: [
        {
          label: "الطلبات",
          href: "/measurements/orders",
          icon: Ruler,
        },
      ],
    },
    {
      title: "إدارة المهام",
      items: [
        {
          label: "جميع المهام",
          href: "/tasks-manager/all-tasks",
          icon: ClipboardList,
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    const normalizedPath = pathname.replace(/^\/(en|ar)/, "");
    const normalizedHref = href.replace(/^\/(en|ar)/, "");
    return (
      normalizedPath === normalizedHref ||
      normalizedPath.startsWith(normalizedHref + "/")
    );
  };

  const getDefaultValue = () => {
    // Find which section contains the active item
    for (const section of menuSections) {
      if (section.items.some((item) => isActive(item.href))) {
        return section.title;
      }
    }
    return undefined;
  };

  return (
    <>
      <div
        className={cn(
          "fixed right-0 top-0 h-full text-[#2a3042] flex flex-col z-40 transition-all duration-300 ease-in-out",
          "bg-white"
        )}
        style={{ width: isOpen ? "220px" : "64px" }}
      >
        {/* Logo Section */}
        <div className={cn(
          "transition-all duration-300",
          isOpen ? "p-6" : "p-4 flex justify-center"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            {isOpen && (
              <span className="text-xl font-bold whitespace-nowrap">ALUMEX</span>
            )}
          </div>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 overflow-y-auto p-4">
          {isOpen ? (
            <Accordion
              type="single"
              collapsible
              defaultValue={getDefaultValue()}
              className="w-full"
            >
              {menuSections.map((section, sectionIndex) => (
                <AccordionItem
                  key={sectionIndex}
                  value={section.title}
                  className="border-none mb-4"
                >
                  <AccordionTrigger className="text-black text-sm font-semibold uppercase py-1.5 hover:no-underline">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <div className="space-y-1">
                      {section.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon || Home;
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-1.5 rounded-md text-xs transition-colors text-gray-500",
                              active
                                ? "font-semibold"
                                : ""
                            )}
                          >
                            - <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div>
              {menuSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const ItemIcon = item.icon || Home;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center px-1.5 py-2 rounded-md text-xs transition-colors",
                          active
                            ? "bg-blue-600 text-blue-950 font-semibold"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        )}
                        title={item.label}
                      >
                        <ItemIcon className="size-5" />
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className={cn(
          "border-t border-gray-700 space-y-2 transition-all duration-300",
          isOpen ? "p-4" : "p-2"
        )}>
          <Button
            variant="ghost"
            className={cn(
              "w-full text-gray-300 hover:bg-gray-700 transition-all duration-300 text-sm",
              isOpen ? "justify-start" : "justify-center"
            )}
            onClick={() => onOpen(EModalType.LOGOUT)}
            title="تسجيل الخروج"
          >
            <LogOut className={cn("size-4", isOpen ? "ml-2" : "")} />
            {isOpen && <span>تسجيل الخروج</span>}
          </Button>
          {/* <Button
            variant="ghost"
            className={cn(
              "w-full text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300",
              isOpen ? "justify-start" : "justify-center"
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={mounted && theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
          >
            {mounted && theme === "dark" ? (
              <Sun className={cn("size-4", isOpen ? "ml-2" : "")} />
            ) : (
              <Moon className={cn("size-4", isOpen ? "ml-2" : "")} />
            )}
            {isOpen && (
              <span>{mounted && theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}</span>
            )}
          </Button> */}
        </div>
      </div>
      <LogoutModal />
    </>
  );
};
