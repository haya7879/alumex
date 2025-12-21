"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Tabs, { TabItem } from "@/components/shared/tabs";
import { Plus, Calendar, FileX, FileText } from "lucide-react";

export default function DailyFollowUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname?.includes("add-new-form")) return "add-new-form";
    if (pathname?.includes("rejected-forms")) return "rejected-forms";
    if (pathname?.includes("signed-contracts")) return "signed-contracts";
    return "daily-schedule";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when pathname changes
  useEffect(() => {
    const newActiveTab = getActiveTab();
    setActiveTab(newActiveTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case "add-new-form":
        router.push("/sales/daily-follow-up/add-new-form");
        break;
      case "daily-schedule":
        router.push("/sales/daily-follow-up");
        break;
      case "rejected-forms":
        router.push("/sales/daily-follow-up/rejected-forms");
        break;
      case "signed-contracts":
        router.push("/sales/daily-follow-up/signed-contracts");
        break;
    }
  };

  const tabs: TabItem[] = [
    {
      value: "add-new-form",
      label: "إضافة نموذج جديد",
      icon: Plus,
      content: children,
    },
    {
      value: "daily-schedule",
      label: "برنامج المتابعة اليومي",
      icon: Calendar,
      content: children,
    },
    {
      value: "rejected-forms",
      label: "النماذج المرفوضة",
      icon: FileX,
      content: children,
    },
    {
      value: "signed-contracts",
      label: "جدول العقود الموقعة",
      icon: FileText,
      content: children,
    },
  ];

  return (
    <div className="mt-5">
      <Tabs
        items={tabs}
        value={activeTab}
        onValueChange={handleTabChange}
      />
    </div>
  );
}

