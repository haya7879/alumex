"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { Calendar, FileCheck, FileX, Plus } from "lucide-react";
import { ReactNode } from "react";

export default function DailyFollowUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerLinks = [
    {
      label: "جدول الزيارات اليومية",
      href: "/sales/daily-visits",
      icon: Calendar,
      exact: true,
    },
    {
      label: "إضافة زيارة جديدة",
      href: "/sales/daily-visits/create",
      icon: Plus,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title="الزيارات اليومية"
          breadcrumb={[
            { label: "المبيعات", href: "/sales" },
            { label: "الزيارات اليومية", href: "/sales/daily-visits" },
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
