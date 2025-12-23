"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  FilterField,
} from "@/components/shared/filter-sheet";

// Data interface
export interface OrderRowData {
  customerName: string;
  phone: string;
  location: string;
  measurementType: string;
  date: string;
  contractStatus: "contract" | "without";
  projectManager: string;
  status: "waiting" | "measurement-taken" | "check-taken";
}

// Sample data based on the image
const tableData: OrderRowData[] = [
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "waiting",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "waiting",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "مؤجل",
    date: "23/8/2525",
    contractStatus: "without",
    projectManager: "لهيب الهيب",
    status: "measurement-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "تشك",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "measurement-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "شركة اليد البناء",
    date: "23/8/2525",
    contractStatus: "without",
    projectManager: "لهيب الهيب",
    status: "measurement-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "شركة اليد البناء",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "waiting",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "شركة اليد البناء",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "waiting",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "تشك",
    date: "23/8/2525",
    contractStatus: "without",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "شركة اليد البناء",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "waiting",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "شركة اليد البناء",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "waiting",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "شركة اليد البناء",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "waiting",
  },
];

// Table columns
const columns: Column<OrderRowData>[] = [
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
    key: "measurementType",
    header: "نوع القياسات",
  },
  {
    key: "date",
    header: "التاريخ",
  },
  {
    key: "contractStatus",
    header: "عقد / بدون عقد",
    render: (row) => {
      return row.contractStatus === "contract" ? "عقد" : "بدون";
    },
  },
  {
    key: "projectManager",
    header: "مدير المشروع",
  },
  {
    key: "status",
    header: "الحالة",
    render: (row) => {
      const statusConfig = {
        waiting: {
          label: "في حالة انتظار",
          variant: "default" as const,
        },
        "measurement-taken": {
          label: "تم أخذ القياس",
          variant: "success" as const,
        },
        "check-taken": {
          label: "تم أخذ التشك",
          variant: "warning" as const,
        },
      };

      const config = statusConfig[row.status];

      return (
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} className="px-3 py-1">
            {config.label}
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

export default function OrdersPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for orders
  const filterFields: FilterField[] = [
    {
      key: "customerName",
      label: "اسم الزبون",
      type: "input",
      placeholder: "اسم الزبون",
    },
    {
      key: "company",
      label: "الحالة",
      type: "select",
      placeholder: "أختر الشركة من القائمة",
      options: [
        { value: "company1", label: "شركة 1" },
        { value: "company2", label: "شركة 2" },
        { value: "company3", label: "شركة 3" },
      ],
    },
    {
      key: "delegate",
      label: "المندوب",
      type: "select",
      placeholder: "أختر المندوب من القائمة",
      options: [
        { value: "rep1", label: "مندوب 1" },
        { value: "rep2", label: "مندوب 2" },
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
