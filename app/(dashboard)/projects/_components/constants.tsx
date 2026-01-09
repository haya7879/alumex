import { HeaderLink } from "@/components/shared/dynamic-layout";
import { Calendar, FileText, List, Plus } from "lucide-react";

// Map path segments to Arabic labels
export const pathLabels: Record<string, string> = {
  projects: "المشاريع",
  descriptions: "الوصوف",
  contracts: "قائمة العقود",
  "production-orders": "طلبات الانتاج",
  "order-details": "طلبات التفصيلي",
  create: "إضافة",
};

// Map routes to their header links
export const routeHeaderLinks: Record<string, HeaderLink[]> = {
  followups: [
    {
      label: "برنامج المتابعة",
      href: "/projects",
      icon: Calendar,
      exact: true,
    },
  ],
  descriptions: [
    {
      label: "إضافة وصف",
      href: "/projects/descriptions/create",
      icon: Plus,
    },
    {
      label: "عرض الوصوف",
      href: "/projects/descriptions",
      icon: List,
      exact: true,
    },
  ],
  contracts: [
    {
      label: "طلبات التفصيلي",
      href: "/projects/contracts/order-details",
      icon: FileText,
    },
    {
      label: "قائمة العقود",
      href: "/projects/contracts",
      icon: FileText,
      exact: true,
    },
  ],
  "production-orders": [
    {
      label: "طلبات الانتاج",
      href: "/projects/production-orders",
      icon: List,
      exact: true,
    },
  ],
};

// Map routes to their default titles
export const routeDefaultTitles: Record<string, string> = {
  followups: "برنامج المتابعة",
  descriptions: "الوصوف",
  contracts: "قائمة العقود",
  "production-orders": "طلبات الانتاج",
};
