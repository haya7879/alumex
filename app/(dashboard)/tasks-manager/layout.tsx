"use client";

import DynamicLayout from "@/components/shared/dynamic-layout";
import { Archive, ClipboardList, Plus } from "lucide-react";
import { ReactNode } from "react";

// Map path segments to Arabic labels
const pathLabels: Record<string, string> = {
  "tasks-manager": "إدارة المهام",
  "all-tasks": "جميع المهام",
  create: "إضافة",
  archive: "أرشيف المهام",
};

const headerLinks = [

  {
    label: "إضافة مهمة",
    href: "/tasks-manager/create",
    icon: Plus,
  },
  {
    label: "أرشيف المهام",
    href: "/tasks-manager/archive",
    icon: Archive,
  },
  {
    label: "جميع المهام",
    href: "/tasks-manager/all-tasks",
    icon: ClipboardList,
    exact: true,
  },
];

export default function TasksManagerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DynamicLayout
      pathLabels={pathLabels}
      headerLinks={headerLinks}
      defaultTitle="إدارة المهام"
       className="mr-[90px]"
      layoutVariant="links-first"
    >
      {children}
    </DynamicLayout>
  );
}
