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
          label: "عرض الطلبات",
          href: "/measurements",
          icon: Ruler,
        },
      ],
    },
    {
      title: "إدارة المهام",
      items: [
        {
          label: "عرض جميع المهام",
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
        className="fixed right-0 top-0 h-full text-[#2a3042] flex flex-col z-9999"
        style={{ background: "#fff", width: "230px" }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold">ALUMEX</span>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 overflow-y-auto p-4">
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
                className="border-none"
              >
                <AccordionTrigger className="text-gray-400 text-xs font-semibold uppercase py-2 hover:no-underline">
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
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                            active
                              ? "bg-blue-600 text-white font-semibold"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          )}
                        >
                          <ItemIcon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={() => onOpen(EModalType.LOGOUT)}
          >
            <LogOut className="size-4 ml-2" />
            تسجيل الخروج
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? (
              <Sun className="size-4 ml-2" />
            ) : (
              <Moon className="size-4 ml-2" />
            )}
            {mounted && theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
          </Button>
        </div>
      </div>
      <LogoutModal />
    </>
  );
};
