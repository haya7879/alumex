"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar } from "lucide-react";
import FilterSheet, {
  FilterField,
} from "../../../../modules/sales/components/filter-sheet";

// Data interface
export interface CompanyRowData {
  companyName: string;
  location: string;
  phone: string;
  date: string;
}

// Sample data based on the image
const tableData: CompanyRowData[] = [
  {
    companyName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
  },
  {
    companyName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
  },
  {
    companyName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
  },
  {
    companyName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
  },
  {
    companyName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
  },
  {
    companyName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
  },
  {
    companyName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
  },
  {
    companyName: "حي اللجار",
    location: "أحمد فادي",
    phone: "0963698745",
    date: "1/01/2025",
  },
];

// Table columns
const columns: Column<CompanyRowData>[] = [
  {
    key: "companyName",
    header: "اسم الشركة",
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
    key: "options",
    header: "الخيارات",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
];

export default function CompaniesPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for companies
  const filterFields: FilterField[] = [
    {
      key: "companyName",
      label: "اسم الشركة",
      type: "input",
      placeholder: "اسم الشركة",
    },
    {
      key: "status",
      label: "الحالة",
      type: "select",
      placeholder: "أختر الحالة من القائمة",
      options: [
        { value: "active", label: "نشط" },
        { value: "inactive", label: "غير نشط" },
        { value: "pending", label: "قيد الانتظار" },
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
          title="فلترة الشركات"
          description="استخدم الحقول التالية لفلترة الشركات"
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
