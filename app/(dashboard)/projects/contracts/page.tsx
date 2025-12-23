"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar, Hourglass, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  FilterField,
} from "@/components/shared/filter-sheet";

// Data interface
export interface ContractRowData {
  customerName: string;
  phone: string;
  location: string;
  approvedCompany: string;
  contractSigningDate: string;
  siteReadiness: "ready" | "not-ready";
  nextDayOrder: "send" | "waiting";
}

// Sample data based on the image
const tableData: ContractRowData[] = [
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "not-ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "waiting",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    approvedCompany: "شركة اليد البناء",
    contractSigningDate: "23/8/2525",
    siteReadiness: "ready",
    nextDayOrder: "send",
  },
];

// Table columns
const columns: Column<ContractRowData>[] = [
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
    key: "options",
    header: "",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
];

export default function ContractsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for contracts
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
