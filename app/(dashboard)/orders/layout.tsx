"use client";

import {
  ContainerContent,
  ContainerHeaderLink,
  ContainerHeaderList,
} from "@/components/shared/container";
import PageHeader from "@/components/shared/page-header";
import { Archive, ShoppingCart } from "lucide-react";
import { ReactNode } from "react";

export default function DailyFollowUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerLinks = [
    {
      label: "عرض الطلبات",
      href: "/orders",
      icon: ShoppingCart,
      exact: true,
    },
    {
      label: "الأرشيف",
      href: "/orders/archive",
      icon: Archive,
    },
  ];
  return (
    <>
      <div className="bg-white rounded-lg">
        <PageHeader
          title="الطلبات"
          breadcrumb={[
            { label: "الطلبات", href: "/orders" },
            { label: "عرض الطلبات", href: "/orders" },
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
