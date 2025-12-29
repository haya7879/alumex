"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import {
  FilterField,
} from "../../../../components/shared/filter-sheet";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Data interface
export interface DailyMovementRowData {
  location: string;
  customerName: string;
  phone: string;
  notes: string;
  date: string;
  status: "completed" | "not-completed" | "postponed";
  options?: React.ReactNode;
}

// Sample data based on the image
const tableData: DailyMovementRowData[] = [
  {
    location: "حي اللجار",
    customerName: "أحمد فادي",
    phone: "0963698745",
    notes: "_/_/_/_",
    date: "1/01/2025",
    status: "completed",
  },
  {
    location: "حي اللجار",
    customerName: "أحمد فادي",
    phone: "0963698745",
    notes: "_/_/_/_",
    date: "1/01/2025",
    status: "completed",
  },
  {
    location: "حي اللجار",
    customerName: "أحمد فادي",
    phone: "0963698745",
    notes: "_/_/_/_",
    date: "1/01/2025",
    status: "completed",
  },
  {
    location: "حي اللجار",
    customerName: "أحمد فادي",
    phone: "0963698745",
    notes: "_/_/_/_",
    date: "1/01/2025",
    status: "not-completed",
  },
  {
    location: "حي اللجار",
    customerName: "أحمد فادي",
    phone: "0963698745",
    notes: "_/_/_/_",
    date: "1/01/2025",
    status: "completed",
  },
  {
    location: "حي اللجار",
    customerName: "أحمد فادي",
    phone: "0963698745",
    notes: "8/02/2025",
    date: "1/01/2025",
    status: "postponed",
  },
  {
    location: "حي اللجار",
    customerName: "أحمد فادي",
    phone: "0963698745",
    notes: "8/02/2025",
    date: "1/01/2025",
    status: "postponed",
  },
  {
    location: "حي اللجار",
    customerName: "أحمد فادي",
    phone: "0963698745",
    notes: "8/02/2025",
    date: "1/01/2025",
    status: "postponed",
  },
];

// Table columns
const columns: Column<DailyMovementRowData>[] = [
  {
    key: "location",
    header: "الموقع",
  },
  {
    key: "customerName",
    header: "اسم الزبون",
  },
  {
    key: "phone",
    header: "رقم الهاتف",
  },
  {
    key: "notes",
    header: "الملاحظات",
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
    key: "options",
    header: "الخيارات",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
];

export default function DailyMovementPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };


  // Define filter fields for daily movement
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
      key: "representative",
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
    <>
      <DataTable
        data={tableData}
        columns={columns}
        emptyMessage="لا توجد بيانات للعرض"
        enableExport
        exportFilename="daily-movement"
        enableFilter
        filterFields={filterFields}
        initialFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        enableSearch
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          console.log("Search Query:", value);
        }}
        searchPlaceholder="Search"
        searchWidth="250px"
      />

      {/* Pagination */}
      <TablePagination
        currentPage={1}
        totalPages={1}
        pageSize={10}
        totalItems={tableData.length}
        onPageChange={() => {}}
      />
    </>
  );
}
