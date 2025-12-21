"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { Archive, ClipboardList, Plus } from "lucide-react";
import { ReactNode } from "react";

export default function DailyFollowUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerLinks = [
    {
      label: "عرض جميع المهام",
      href: "/tasks-manager/all-tasks",
      icon: ClipboardList,
      exact: true,
    },
    {
      label: "إضافة مهمة جديدة",
      href: "/tasks-manager/create",
      icon: Plus,
    },
    {
      label: "أرشيف المهام",
      href: "/tasks-manager/archive",
      icon: Archive,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title="إدارة المهام"
          breadcrumb={[
            { label: "إدارة المهام", href: "/tasks-manager" },
            { label: "عرض جميع المهام", href: "/tasks-manager/all-tasks" },
          ]}
        />
        <ContainerHeaderList>
          {headerLinks.map((link, index) => (
            <ContainerHeaderLink
              key={index}
              label={link.label}
              href={link.href}
              Icon={link.icon}
              exact={link.exact}
            />
          ))}
        </ContainerHeaderList>
        <ContainerContent>{children}</ContainerContent>
      </div>
    </>
  );
}
