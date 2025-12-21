"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { Archive, FileText, List, Plus, ShoppingCart } from "lucide-react";
import { ReactNode } from "react";

export default function DailyFollowUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerLinks = [
    {
      label: "عرض الوصوف النشطة",
      href: "/projects/descriptions",
      icon: List,
      exact: true,
    },
    {
      label: "انشاء وصف جديد",
      href: "/projects/descriptions/create",
      icon: Plus,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title="الوصوف"
          breadcrumb={[
            { label: "عرض الوصوف النشطة", href: "/descriptions" },
            { label: "انشاء وصف جديد", href: "/descriptions/create" },
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
