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
      <TabsList className={cn("w-full justify-start bg-transparent border-b rounded-none", listClassName)}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={cn(
                "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none",
                triggerClassName
              )}
            >
              {Icon && <Icon className="size-4 ml-2" />}
              {item.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className={cn("mt-4", contentClassName)}
        >
          {item.content}
        </TabsContent>
      ))}
    </UITabs>
  );
}

