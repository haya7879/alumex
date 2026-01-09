"use client";

import { useState, useMemo } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FilterField,
} from "@/components/shared/filter-sheet";
import { useDateConverter } from "@/hooks/use-date-converter";

// Data interface for Project Follow-up
export interface ProjectFollowUpRowData {
  id: number;
  projectNumber: string;
  projectName: string;
  financialStatus: "paid" | "partial" | "unpaid";
  completionDuration: string;
  notes: string;
  // Main dates
  contractSigningDate: string | null;
  detailedMeasurementDate: string | null;
  formingMeasurementDate: string | null;
  descriptionApprovalDate: string | null;
  productionSendDate: string | null;
  // Postponement data (if exists)
  hasPostponements: boolean;
  postponementMeasurementDate: string | null;
  postponementApprovalDate: string | null;
  postponementProductionSendDate: string | null;
}

// Sample data
const tableData: ProjectFollowUpRowData[] = [
  {
    id: 1,
    projectNumber: "P001",
    projectName: "شركة اليد البناء م. عباس المحترم",
    financialStatus: "partial",
    completionDuration: "45 يوم",
    notes: "ملاحظات المشروع",
    contractSigningDate: "2025-01-15",
    detailedMeasurementDate: "2025-01-20",
    formingMeasurementDate: "2025-01-25",
    descriptionApprovalDate: "2025-02-01",
    productionSendDate: "2025-02-10",
    hasPostponements: true,
    postponementMeasurementDate: "2025-02-15",
    postponementApprovalDate: "2025-02-20",
    postponementProductionSendDate: "2025-02-25",
  },
  {
    id: 2,
    projectNumber: "P002",
    projectName: "مشروع البناء الحديث",
    financialStatus: "paid",
    completionDuration: "30 يوم",
    notes: "-",
    contractSigningDate: "2025-01-10",
    detailedMeasurementDate: "2025-01-15",
    formingMeasurementDate: "2025-01-18",
    descriptionApprovalDate: "2025-01-25",
    productionSendDate: "2025-02-05",
    hasPostponements: false,
    postponementMeasurementDate: null,
    postponementApprovalDate: null,
    postponementProductionSendDate: null,
  },
  {
    id: 3,
    projectNumber: "P003",
    projectName: "مشروع المباني السكنية",
    financialStatus: "unpaid",
    completionDuration: "60 يوم",
    notes: "يتطلب متابعة خاصة",
    contractSigningDate: "2025-01-05",
    detailedMeasurementDate: "2025-01-12",
    formingMeasurementDate: null,
    descriptionApprovalDate: null,
    productionSendDate: null,
    hasPostponements: false,
    postponementMeasurementDate: null,
    postponementApprovalDate: null,
    postponementProductionSendDate: null,
  },
];

export default function ProjectsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const { formatDate } = useDateConverter();

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields
  const filterFields: FilterField[] = [
    {
      key: "projectNumber",
      label: "رقم المشروع",
      type: "input",
      placeholder: "رقم المشروع",
    },
    {
      key: "projectName",
      label: "اسم المشروع",
      type: "input",
      placeholder: "اسم المشروع",
    },
    {
      key: "financialStatus",
      label: "الوضع المالي",
      type: "select",
      placeholder: "اختر الوضع المالي",
      options: [
        { value: "paid", label: "مدفوع" },
        { value: "partial", label: "جزئي" },
        { value: "unpaid", label: "غير مدفوع" },
      ],
    },
  ];

  // Table columns
  const columns: Column<ProjectFollowUpRowData>[] = useMemo(() => [
    {
      key: "projectNumber",
      header: "رقم المشروع",
    },
    {
      key: "projectName",
      header: "اسم المشروع",
    },
    {
      key: "financialStatus",
      header: "الوضع المالي",
      render: (row) => {
        const statusConfig = {
          paid: { label: "مدفوع", variant: "success" as const },
          partial: { label: "جزئي", variant: "warning" as const },
          unpaid: { label: "غير مدفوع", variant: "destructive" as const },
        };
        const config = statusConfig[row.financialStatus];
        return (
          <Badge variant={config.variant} className="px-3 py-1">
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "completionDuration",
      header: "مدة الإنجاز",
    },
    {
      key: "contractSigningDate",
      header: "تاريخ توقيع العقد",
      render: (row) => (row.contractSigningDate ? formatDate(row.contractSigningDate) : "-"),
    },
    {
      key: "detailedMeasurementDate",
      header: "تاريخ أخذ القياس التفصيلي",
      render: (row) => (row.detailedMeasurementDate ? formatDate(row.detailedMeasurementDate) : "-"),
    },
    {
      key: "formingMeasurementDate",
      header: "تاريخ أخذ قياس تشك",
      render: (row) => (row.formingMeasurementDate ? formatDate(row.formingMeasurementDate) : "-"),
    },
    {
      key: "descriptionApprovalDate",
      header: "تاريخ اعتماد الوصف",
      render: (row) => (row.descriptionApprovalDate ? formatDate(row.descriptionApprovalDate) : "-"),
    },
    {
      key: "productionSendDate",
      header: "تاريخ ارسال للانتاج",
      render: (row) => (row.productionSendDate ? formatDate(row.productionSendDate) : "-"),
    },
    {
      key: "postponementMeasurementDate",
      header: "تاريخ أخذ قياس المؤجلات",
      render: (row) => {
        if (!row.hasPostponements) return "-";
        return row.postponementMeasurementDate ? formatDate(row.postponementMeasurementDate) : "-";
      },
    },
    {
      key: "postponementApprovalDate",
      header: "تاريخ اعتماد المؤجلات",
      render: (row) => {
        if (!row.hasPostponements) return "-";
        return row.postponementApprovalDate ? formatDate(row.postponementApprovalDate) : "-";
      },
    },
    {
      key: "postponementProductionSendDate",
      header: "تاريخ ارسال انتاج المؤجلات",
      render: (row) => {
        if (!row.hasPostponements) return "-";
        return row.postponementProductionSendDate ? formatDate(row.postponementProductionSendDate) : "-";
      },
    },
    {
      key: "notes",
      header: "الملاحظات",
    },
    {
      key: "options",
      header: "",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center">
              <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                console.log("View project:", row.projectNumber);
                // Handle view action
              }}
            >
              <Eye className="size-4 ml-2" />
              عرض
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("Edit project:", row.projectNumber);
                // Handle edit action
              }}
            >
              <Edit className="size-4 ml-2" />
              تعديل
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [formatDate]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <DataTable
          data={tableData}
          columns={columns}
          emptyMessage="لا توجد بيانات للعرض"
          enableFilter
          filterFields={filterFields}
          initialFilters={appliedFilters}
          onApplyFilters={handleApplyFilters}
        />
      </div>

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
