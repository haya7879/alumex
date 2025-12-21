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
      label: "جدول الشركات",
      href: "/sales/companies",
      icon: Calendar,
      exact: true,
    },
    {
      label: "إضافة شركة جديدة",
      href: "/sales/companies/create",
      icon: Plus,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title="الشركات المعتمدة"
          breadcrumb={[
            { label: "المبيعات", href: "/sales" },
            { label: "الشركات المعتمدة", href: "/sales/companies" },
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
