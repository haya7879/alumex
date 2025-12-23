"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FilterField,
} from "@/components/shared/filter-sheet";

// Data interface
export interface ProductionOrderRowData {
  projectName: string;
  remainingDays: string;
  phone: string;
  followUp: string;
  descriptionDate: string;
  order: "main" | "deferred";
  download: "paid" | "unpaid";
  installation: "paid" | "unpaid";
  status: "ready-for-delivery";
}

// Sample data based on the image
const tableData: ProductionOrderRowData[] = [
  {
    projectName: "شركة اليد البناء م. عباس المحترم لين",
    remainingDays: "30 يوم",
    phone: "07 705582933",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    order: "main",
    download: "paid",
    installation: "unpaid",
    status: "ready-for-delivery",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم لين",
    remainingDays: "30 يوم",
    phone: "07 705582933",
    followUp: "لهيب الهيب",
    descriptionDate: "23/2/2025",
    order: "deferred",
    download: "unpaid",
    installation: "unpaid",
    status: "ready-for-delivery",
  },
];

// Table columns
const columns: Column<ProductionOrderRowData>[] = [
  {
    key: "projectName",
    header: "اسم المشروع",
  },
  {
    key: "remainingDays",
    header: "عدد الأيام المتبقي",
  },
  {
    key: "phone",
    header: "رقم الهاتف",
  },
  {
    key: "followUp",
    header: "المتابعة",
  },
  {
    key: "descriptionDate",
    header: "تاريخ الوصف",
  },
  {
    key: "order",
    header: "الطلب",
    render: (row) => {
      return row.order === "main" ? (
        <Badge variant="default" className="px-3 py-1">
          رئيسي
        </Badge>
      ) : (
        <Badge variant="warning" className="px-3 py-1">
          مؤجل
        </Badge>
      );
    },
  },
  {
    key: "download",
    header: "التنزيل",
    render: (row) => {
      return row.download === "paid" ? (
        <Badge variant="success" className="px-3 py-1">
          مدفوع
        </Badge>
      ) : (
        <Badge variant="destructive" className="px-3 py-1">
          غير مدفوع
        </Badge>
      );
    },
  },
  {
    key: "installation",
    header: "التركيب",
    render: (row) => {
      return row.installation === "paid" ? (
        <Badge variant="success" className="px-3 py-1">
          مدفوع
        </Badge>
      ) : (
        <Badge variant="destructive" className="px-3 py-1">
          غير مدفوع
        </Badge>
      );
    },
  },
  {
    key: "status",
    header: "الحالة",
    render: (row) => {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1">
            جاهز للتسليم
          </Badge>
        </div>
      );
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

export default function ProductionOrdersPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({
    serialNumber: "K5430",
  });

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for production orders
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
      key: "serialNumber",
      label: "الرقم التسلسلي",
      type: "input",
      placeholder: "الرقم التسلسلي",
      defaultValue: "K5430",
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={tableData}
        columns={columns}
        emptyMessage="لا توجد بيانات للعرض"
        enableFilter
        filterFields={filterFields}
        initialFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Pagination */}
      <TablePagination
        currentPage={1}
        totalPages={1}
        pageSize={10}
        totalItems={tableData.length}
        onPageChange={() => {}}
      />
    </div>
  );
}
