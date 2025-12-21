"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { FolderKanban, Plus } from "lucide-react";
import { ReactNode } from "react";

export default function DailyFollowUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerLinks = [
    {
      label: "المقاطع المتاحة",
      href: "/sales/section-options",
      icon: FolderKanban,
      exact: true,
    },
    {
      label: "إضافة مقطع",
      href: "/sales/section-options/create",
      icon: Plus,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title="خيارات المقاطع"
          breadcrumb={[
            { label: "المبيعات", href: "/sales" },
            { label: "خيارات المقاطع", href: "/sales/section-options" },
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
