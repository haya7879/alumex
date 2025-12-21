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
      label: "برنامج المتابعة اليومي",
      href: "/sales/daily-follow-up",
      icon: Calendar,
      exact: true,
    },
    {
      label: "العقود الموقعة",
      href: "/sales/daily-follow-up/signed-contracts",
      icon: FileCheck,
    },
    {
      label: "النماذج المرفوضة",
      href: "/sales/daily-follow-up/rejected-forms",
      icon: FileX,
    },
    {
      label: "إضافة نموذج جديد",
      href: "/sales/daily-follow-up/add-new-form",
      icon: Plus,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title="المتابعة اليومية"
          breadcrumb={[
            { label: "المبيعات", href: "/sales" },
            { label: "المتابعة اليومية", href: "/sales/daily-follow-up" },
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
