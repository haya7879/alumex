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
export interface ArchiveOrderRowData {
  customerName: string;
  phone: string;
  location: string;
  measurementType: string;
  date: string;
  contractStatus: "contract" | "without";
  projectManager: string;
  status: "check-taken";
}

// Sample data based on the image - all rows have same data with "check-taken" status
const tableData: ArchiveOrderRowData[] = [
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم لين",
    phone: "07 705582933",
    location: "حي العمارة",
    measurementType: "رئيسي",
    date: "23/8/2525",
    contractStatus: "contract",
    projectManager: "لهيب الهيب",
    status: "check-taken",
  },
];

// Table columns
const columns: Column<ArchiveOrderRowData>[] = [
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
      return (
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="px-3 py-1">
            تم أخذ التشك
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

export default function ArchiveOrdersPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for archive orders
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
        { value: "company1", label: "شركة 1" },
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
