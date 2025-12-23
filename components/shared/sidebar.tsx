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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  icon?: React.ElementType;
}

export const Sidebar = () => {
  const { onOpen } = useModalStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Menu sections
  const menuSections: MenuSection[] = [
    {
      title: "قسم المبيعات",
      icon: ShoppingCart,
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
          href: "/sales/daily-movement",
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
      icon: DollarSign,
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
      icon: FolderKanban,
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
      icon: Ruler,
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
      icon: ClipboardList,
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

  const isSectionActive = (section: MenuSection) => {
    return section.items.some((item) => isActive(item.href));
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
          <div className="flex items-center gap-3 justify-center">
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
            <div className="space-y-4">
              {menuSections.map((section, sectionIndex) => {
                const SectionIcon = section.icon || section.items[0]?.icon || Home;
                const sectionActive = isSectionActive(section);
                const isHovered = hoveredSection === section.title;

                return (
                  <Popover
                    key={sectionIndex}
                    open={isHovered}
                    onOpenChange={(open) => setHoveredSection(open ? section.title : null)}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center justify-center px-1.5 py-2 rounded-md text-xs transition-colors cursor-pointer",
                          sectionActive
                            ? "text-blue-950 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                        onMouseEnter={() => setHoveredSection(section.title)}
                        onMouseLeave={() => setHoveredSection(null)}
                        title={section.title}
                      >
                        <SectionIcon className="size-5" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      side="left"
                      align="start"
                      style={{width:"170px"}}
                      className="p-2"
                      onMouseEnter={() => setHoveredSection(section.title)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      <div className="space-y-1">
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-700 border-b border-gray-200 mb-1">
                          {section.title}
                        </div>
                        {section.items.map((item, itemIndex) => {
                          const ItemIcon = item.icon || Home;
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={itemIndex}
                              href={item.href}
                              className={cn(
                                "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                                active
                                  ? "bg-blue-50 text-blue-600 font-semibold"
                                  : "text-gray-700 hover:bg-gray-100"
                              )}
                              onClick={() => setHoveredSection(null)}
                            >
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
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
              "w-full text-black hover:bg-gray-700 hover:text-white transition-all duration-300 text-sm",
              isOpen ? "justify-start" : "justify-center"
            )}
            onClick={() => onOpen(EModalType.LOGOUT)}
            title="تسجيل الخروج"
          >
            <LogOut className={cn("size-4", isOpen ? "ml-2" : "")} />
            {isOpen && <span>تسجيل الخروج</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full text-black hover:bg-gray-700 hover:text-white transition-all duration-300",
              isOpen ? "justify-start" : "justify-center"
            )}
            // onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
          </Button>
        </div>
      </div>
      <LogoutModal />
    </>
  );
};
