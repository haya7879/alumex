"use client";

import { DataTable } from "@/components/table/data-table";
import { columns, TableRowData } from "@/modules/sales/components/columns";
import { FilterField } from "@/components/shared/filter-sheet";
import { TablePagination } from "@/components/table";
import { useState } from "react";

// Sample data for rejected forms
const tableData: TableRowData[] = [
  {
    customerName: "شركة الرفض 1",
    phone: "07 123456789",
    lastOfferDate: "15/8/2525",
    lastOfferPrice: "300,000",
    receivedOffer: "نعم",
    response: "مرفوض",
    followUp: { origin: "red" as any, branch: "blue" },
  },
  {
    customerName: "شركة الرفض 2",
    phone: "07 987654321",
    lastOfferDate: "20/8/2525",
    lastOfferPrice: "250,000",
    receivedOffer: "لا",
    response: "مرفوض",
    followUp: { origin: "red" as any, branch: "blue" },
  },
];

export default function RejectedFormsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
  };

  const filterFields: FilterField[] = [
    {
      key: "customerName",
      label: "اسم الزبون",
      type: "input",
      placeholder: "ابحث باسم الزبون",
    },
    {
      key: "rejectionReason",
      label: "سبب الرفض",
      type: "select",
      placeholder: "اختار اجابة من القائمة",
      options: [
        { value: "price", label: "السعر" },
        { value: "quality", label: "الجودة" },
        { value: "other", label: "أخرى" },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      <DataTable
        data={tableData}
        columns={columns}
        emptyMessage="لا توجد بيانات للعرض"
        enableFilter
        filterFields={filterFields}
        initialFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
      />
      <TablePagination currentPage={1} totalPages={1} pageSize={10} totalItems={2} onPageChange={() => {}} />
    </div>
  );
}

