import { HeaderLink } from "@/components/shared/dynamic-layout";
import { Calendar, FileCheck, FileX, FolderKanban, Plus } from "lucide-react";

// Map routes to their header links
export const routeHeaderLinks: Record<string, HeaderLink[]> = {
    "daily-follow-up": [
      {
        label: "إضافة نموذج",
        href: "/sales/daily-follow-up/create",
        icon: Plus,
      },
      {
        label: "النماذج المرفوضة",
        href: "/sales/daily-follow-up/rejected-forms",
        icon: FileX,
      },
      {
        label: "العقود الموقعة",
        href: "/sales/daily-follow-up/signed-contracts",
        icon: FileCheck,
      },
      {
        label: "برنامج المتابعة اليومي",
        href: "/sales/daily-follow-up",
        icon: Calendar,
        exact: true,
      },
    ],
    "daily-movement": [
      {
        label: "إضافة حركة",
        href: "/sales/daily-movement/create",
        icon: Plus,
      },
      {
        label: "الحركة اليومية",
        href: "/sales/daily-movement",
        icon: Calendar,
        exact: true,
      },
    ],
    "daily-visits": [
      {
        label: "إضافة زيارة",
        href: "/sales/daily-visits/create",
        icon: Plus,
      },
      {
        label: "جدول الزيارات اليومية",
        href: "/sales/daily-visits",
        icon: Calendar,
        exact: true,
      },
    ],
    companies: [
      {
        label: "إضافة شركة",
        href: "/sales/companies/create",
        icon: Plus,
      },
      {
        label: "جدول الشركات",
        href: "/sales/companies",
        icon: Calendar,
        exact: true,
      },
    ],
    "section-options": [
      {
        label: "إضافة مقطع",
        href: "/sales/section-options/create",
        icon: Plus,
      },
      {
        label: "المقاطع المتاحة",
        href: "/sales/section-options",
        icon: FolderKanban,
        exact: true,
      },
    ],
  };


  // Map path segments to Arabic labels
export const pathLabels: Record<string, string> = {
    sales: "المبيعات",
    "daily-follow-up": "المتابعة اليومية",
    "rejected-forms": "النماذج المرفوضة",
    "signed-contracts": "العقود الموقعة",
    "daily-movement": "الحركة اليومية",
    "daily-visits": "الزيارات اليومية",
    companies: "الشركات المعتمدة",
    "section-options": "خيارات المقاطع",
    create: "إضافة",
  };
  
  
  // Map routes to their default titles
 export const routeDefaultTitles: Record<string, string> = {
    "daily-follow-up": "المتابعة اليومية",
    "daily-movement": "الحركة اليومية",
    "daily-visits": "الزيارات اليومية",
    companies: "الشركات المعتمدة",
    "section-options": "خيارات المقاطع",
  };