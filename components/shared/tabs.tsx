"use client";

import { ReactNode } from "react";
import { Tabs as UITabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface TabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export default function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  listClassName,
  triggerClassName,
  contentClassName,
}: TabsProps) {
  return (
    <UITabs
      defaultValue={defaultValue || items[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={cn("w-full", className)}
    >
      <TabsList className={cn("w-full justify-start bg-transparent gap-2 p-0 h-auto", listClassName)}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                "data-[state=active]:bg-[#E8F5E9] data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
                "border border-transparent data-[state=active]:border-gray-200",
                triggerClassName
              )}
            >
              {Icon && <Icon className="size-4" />}
              <span>{item.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className={cn("mt-6", contentClassName)}
        >
          {item.content}
        </TabsContent>
      ))}
    </UITabs>
  );
}

