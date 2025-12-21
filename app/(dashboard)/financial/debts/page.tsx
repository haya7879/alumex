"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar } from "lucide-react";
import FilterSheet, {
  FilterField,
} from "../../../../modules/sales/components/filter-sheet";

// Data interface
export interface DebtRowData {
  customerName: string;
  phone: string;
  location: string;
  measurementType: string;
  date: string;
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
}

// Sample data based on the image
const tableData: DebtRowData[] = [
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "اضافي",
    date: "23/8/2525",
    totalAmount: "131,23,44",
    paidAmount: "131,23,44",
    remainingAmount: "131,23,44",
  },
];

// Table columns
const columns: Column<DebtRowData>[] = [
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
    key: "totalAmount",
    header: "المبلغ الكلي",
  },
  {
    key: "paidAmount",
    header: "المبلغ المدفوع",
  },
  {
    key: "remainingAmount",
    header: "المبلغ الباقي",
  },
  {
    key: "options",
    header: "",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
];

export default function DebtsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for debts
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
      {/* Filter Section */}
      <div className="flex justify-end">
        <FilterSheet
          fields={filterFields}
          initialFilters={appliedFilters}
          onApplyFilters={handleApplyFilters}
          title="فلترة المستحقات"
          description="استخدم الحقول التالية لفلترة المستحقات"
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

