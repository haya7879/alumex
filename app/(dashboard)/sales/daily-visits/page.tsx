"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FilterSheet, {
  FilterField,
} from "../../../../modules/sales/components/filter-sheet";

// Data interface
export interface DailyVisitRowData {
  customerName: string;
  location: string;
  phone: string;
  date: string;
  status: "completed" | "not-completed" | "postponed";
  followUp?: string;
  governorates?: string;
}

// Sample data based on the image
const tableData: DailyVisitRowData[] = [
  {
    customerName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
    status: "completed",
  },
  {
    customerName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
    status: "completed",
  },
  {
    customerName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
    status: "completed",
  },
  {
    customerName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
    status: "not-completed",
  },
  {
    customerName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
    status: "completed",
  },
  {
    customerName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
    status: "postponed",
  },
  {
    customerName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
    status: "postponed",
  },
];

// Table columns
const columns: Column<DailyVisitRowData>[] = [
  {
    key: "customerName",
    header: "اسم الزبون",
  },
  {
    key: "location",
    header: "الموقع",
  },
  {
    key: "phone",
    header: "رقم الهاتف",
  },
  {
    key: "date",
    header: "التاريخ",
  },
  {
    key: "status",
    header: "الحالة",
    render: (row) => {
      const statusConfig = {
        completed: {
          label: "تم أخذ القياس",
          variant: "success" as const,
        },
        "not-completed": {
          label: "لم يتم أخذ القياس",
          variant: "destructive" as const,
        },
        postponed: {
          label: "مؤجل",
          variant: "warning" as const,
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
    key: "followUp",
    header: "المتابعة",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
  {
    key: "governorates",
    header: "المحافظات",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
  {
    key: "options",
    header: "الخيارات",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
];

export default function DailyVisitsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for daily visits
  const filterFields: FilterField[] = [
    {
      key: "customerName",
      label: "اسم الزبون",
      type: "input",
      placeholder: "اسم الزبون",
    },
    {
      key: "status",
      label: "الحالة",
      type: "select",
      placeholder: "أختر المندوب من القائمة",
      options: [
        { value: "completed", label: "تم أخذ القياس" },
        { value: "not-completed", label: "لم يتم أخذ القياس" },
        { value: "postponed", label: "مؤجل" },
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
      placeholder: "__/__/____",
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
          title="فلترة الزيارات اليومية"
          description="استخدم الحقول التالية لفلترة الزيارات اليومية"
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
        totalPages={1}
        pageSize={10}
        totalItems={tableData.length}
        onPageChange={() => {}}
      />
    </div>
  );
}

