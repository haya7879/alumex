"use client";

import { useState, useMemo } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Eye, FileText, Plus } from "lucide-react";
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

// Data interface
export interface ContractRowData {
  id: number;
  projectName: string;
  contractSigningDate: string;
  contractValue: string;
  financialStatus: "paid" | "partial" | "unpaid";
}

// Sample data
const tableData: ContractRowData[] = [
  {
    id: 1,
    projectName: "شركة اليد البناء م. عباس المحترم",
    contractSigningDate: "23/8/2025",
    contractValue: "50,000,000 د.ع",
    financialStatus: "paid",
  },
  {
    id: 2,
    projectName: "مشروع البناء الحديث - حي العامرية",
    contractSigningDate: "15/7/2025",
    contractValue: "35,000,000 د.ع",
    financialStatus: "partial",
  },
  {
    id: 3,
    projectName: "مشروع المباني السكنية - حي الجامعة",
    contractSigningDate: "10/6/2025",
    contractValue: "75,000,000 د.ع",
    financialStatus: "unpaid",
  },
  {
    id: 4,
    projectName: "مجمع الأعمال التجاري - المنصور",
    contractSigningDate: "5/8/2025",
    contractValue: "120,000,000 د.ع",
    financialStatus: "paid",
  },
  {
    id: 5,
    projectName: "فيلا سكنية - حي الكرادة",
    contractSigningDate: "20/7/2025",
    contractValue: "28,000,000 د.ع",
    financialStatus: "partial",
  },
];

export default function ContractsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [searchValue, setSearchValue] = useState<string>("");

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Filter data based on search
  const filteredData = tableData.filter((row) => {
    if (searchValue) {
      return row.projectName.toLowerCase().includes(searchValue.toLowerCase());
    }
    return true;
  });

  // Define filter fields for contracts
  const filterFields: FilterField[] = [
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

  // Handlers for actions
  const handleCreateDescription = (contractId: number, projectName: string) => {
    console.log("Create description for contract:", contractId, projectName);
    // TODO: Navigate to create description page or open dialog
    // router.push(`/projects/descriptions/create?contractId=${contractId}`);
  };

  const handleViewContract = (contractId: number, projectName: string) => {
    console.log("View contract:", contractId, projectName);
    // TODO: Navigate to contract view or open contract dialog
  };

  // Table columns
  const columns: Column<ContractRowData>[] = useMemo(() => [
    {
      key: "projectName",
      header: "اسم المشروع",
    },
    {
      key: "contractSigningDate",
      header: "تاريخ توقيع العقد",
    },
    {
      key: "contractValue",
      header: "قيمة العقد",
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
              onClick={() => handleViewContract(row.id, row.projectName)}
            >
              <Eye className="size-4 ml-2" />
              عرض العقد
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleCreateDescription(row.id, row.projectName)}
            >
              <Plus className="size-4 ml-2" />
              إنشاء وصف من عقد
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("View contract with quotation:", row.id);
                // TODO: View contract with quotation
              }}
            >
              <FileText className="size-4 ml-2" />
              عرض العقد مع السعر
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  return (
    <div className="space-y-4">
      <DataTable
        data={filteredData}
        columns={columns}
        emptyMessage="لا توجد بيانات للعرض"
        enableFilter
        filterFields={filterFields}
        initialFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        enableSearch
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="البحث عن اسم المشروع..."
      />

      {/* Pagination */}
      <TablePagination
        currentPage={1}
        totalPages={Math.ceil(filteredData.length / 10)}
        pageSize={10}
        totalItems={filteredData.length}
        onPageChange={() => {}}
      />
    </div>
  );
}
