"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import FilterSheet, {
  FilterField,
} from "../../../../modules/sales/components/filter-sheet";
import { TablePagination } from "@/components/table";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Calendar } from "lucide-react";
import ExportButton from "@/components/shared/export-button";
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Apply search logic here
    console.log("Search Query:", e.target.value);
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
    <div className="space-y-4">
      {/* Filter and Search Section */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="w-[250px]">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              icon={Search}
              className="max-w-md"
            />
          </div>
          <div className="flex items-center gap-3">
            <ExportButton
              data={tableData}
              filename="daily-movement"
              columns={columns.map((col) => ({
                key: col.key,
                header: col.header,
              }))}
            />
            <FilterSheet
              fields={filterFields}
              initialFilters={appliedFilters}
              onApplyFilters={handleApplyFilters}
              title="فلترة الحركة اليومية"
              description="استخدم الحقول التالية لفلترة الحركة اليومية"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
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
