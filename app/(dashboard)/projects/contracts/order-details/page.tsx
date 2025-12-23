"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar, Hourglass, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FilterSheet, {
  FilterField,
} from "@/modules/sales/components/filter-sheet";

// Data interface
export interface OrderDetailRowData {
  customerName: string;
  phone: string;
  location: string;
  approvedCompany: string;
  contractSigningDate: string;
  siteReadiness: "ready" | "not-ready";
  nextDayOrder: "send" | "waiting";
  status: "measurement-taken" | "waiting-response" | "openings-not-ready";
  measurementDate: string;
  measurementEngineer?: string;
}

// Sample data based on the image
const tableData: OrderDetailRowData[] = [
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "measurement-taken",
    measurementDate: "23/8/2525",
    measurementEngineer: "م. مؤمن",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "not-ready",
    nextDayOrder: "waiting",
    status: "waiting-response",
    measurementDate: "23/8/2525",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "openings-not-ready",
    measurementDate: "23/8/2525",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "openings-not-ready",
    measurementDate: "23/8/2525",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "not-ready",
    nextDayOrder: "waiting",
    status: "waiting-response",
    measurementDate: "23/8/2525",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "measurement-taken",
    measurementDate: "23/8/2525",
    measurementEngineer: "م. مؤمن",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "measurement-taken",
    measurementDate: "23/8/2525",
    measurementEngineer: "م. مؤمن",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "measurement-taken",
    measurementDate: "23/8/2525",
    measurementEngineer: "م. مؤمن",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "measurement-taken",
    measurementDate: "23/8/2525",
    measurementEngineer: "م. مؤمن",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "measurement-taken",
    measurementDate: "23/8/2525",
    measurementEngineer: "م. مؤمن",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    location: "حلا أسود",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
    status: "measurement-taken",
    measurementDate: "23/8/2525",
    measurementEngineer: "م. مؤمن",
  },
];

// Table columns
const columns: Column<OrderDetailRowData>[] = [
  {
    key: "customerName",
    header: "اسم الزبون",
  },
  {
    key: "phone",
    header: "رقم الهاتف",
  },
  {
    key: "location",
    header: "الموقع",
  },
  {
    key: "approvedCompany",
    header: "الشركة المعتمدة",
  },
  {
    key: "contractSigningDate",
    header: "تاريخ توقيع العقد",
  },
  {
    key: "siteReadiness",
    header: "جاهزية الموقع",
    render: (row) => {
      return row.siteReadiness === "ready" ? (
        <CheckCircle2 className="size-5 text-green-600" />
      ) : (
        <Hourglass className="size-5 text-red-600" />
      );
    },
  },
  {
    key: "nextDayOrder",
    header: "طلبات اليوم المقبل",
    render: (row) => {
      return row.nextDayOrder === "send" ? (
        <Badge
          variant="secondary"
          className="border-transparent px-3 py-1"
        >
          ارسال طلب تفصيلي
        </Badge>
      ) : (
        <Badge
          variant="warning"
          className="px-3 py-1"
        >
          انتظار الاستجابة
        </Badge>
      );
    },
  },
  {
    key: "status",
    header: "الحالة",
    render: (row) => {
      const statusConfig = {
        "measurement-taken": {
          label: "تم أخذ القياس",
          variant: "success" as const,
        },
        "waiting-response": {
          label: "انتظار الاستجابة",
          variant: "secondary" as const,
        },
        "openings-not-ready": {
          label: "الفتحات غير جاهزة",
          variant: "secondary" as const,
        },
      };

      const config = statusConfig[row.status];

      return (
        <Badge variant={config.variant} className="px-3 py-1">
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: "measurementDate",
    header: "تاريخ أخذ القياس",
  },
  {
    key: "measurementEngineer",
    header: "مهندس القياس",
    render: (row) => {
      return row.measurementEngineer || "-";
    },
  },
  {
    key: "options",
    header: "",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
];

export default function OrderDetailsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for order details
  const filterFields: FilterField[] = [
    {
      key: "fullName",
      label: "الاسم الكامل",
      type: "select",
      placeholder: "أختر المندوب من القائمة",
      options: [
        { value: "delegate1", label: "مندوب 1" },
        { value: "delegate2", label: "مندوب 2" },
        { value: "delegate3", label: "مندوب 3" },
      ],
    },
    {
      key: "approvedCompany",
      label: "الشركات المعتمدة",
      type: "select",
      placeholder: "أختر الشركة من القائمة",
      options: [
        { value: "company1", label: "شركة اليد البناء" },
        { value: "company2", label: "شركة 2" },
        { value: "company3", label: "شركة 3" },
      ],
    },
    {
      key: "date",
      label: "التاريخ",
      type: "date",
      placeholder: "----/--/--",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="flex justify-end">
        <FilterSheet
          fields={filterFields}
          initialFilters={appliedFilters}
          onApplyFilters={handleApplyFilters}
          title="فلترة طلبات التفصيلي"
          description="استخدم الحقول التالية لفلترة طلبات التفصيلي"
        />
      </div>

      <DataTable
        data={tableData}
        columns={columns}
        emptyMessage="لا توجد بيانات للعرض"
      />

      {/* Pagination */}
      <TablePagination
        currentPage={1}
        totalPages={5}
        pageSize={10}
        totalItems={tableData.length}
        onPageChange={() => {}}
      />
    </div>
  );
}

