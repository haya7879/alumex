"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { Archive, FileText, ShoppingCart } from "lucide-react";
import { ReactNode } from "react";

export default function DailyFollowUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerLinks = [
    {
      label: "قائمة العقود",
      href: "/projects/contracts",
      icon: FileText,
      exact: true,
    },
    {
      label: "طلبات التفصيلي",
      href: "/projects/contracts/order-details",
      icon: FileText,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title="قائمة العقود"
          breadcrumb={[
            { label: "قائمة العقود", href: "/projects/contracts" },
            { label: "طلبات التفصيلي", href: "/projects/contracts/order-details" },
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
