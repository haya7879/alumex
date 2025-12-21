"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FileText, Edit, Trash2 } from "lucide-react";

// Data interface
export interface SectionRowData {
  id: number;
  sectionName: string;
  status: "active" | "inactive";
}

// Sample data based on the image
const tableData: SectionRowData[] = [
  {
    id: 1,
    sectionName: "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
    status: "active",
  },
  {
    id: 2,
    sectionName: "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
    status: "active",
  },
  {
    id: 3,
    sectionName: "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
    status: "active",
  },
  {
    id: 4,
    sectionName: "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
    status: "active",
  },
  {
    id: 5,
    sectionName: "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
    status: "active",
  },
  {
    id: 6,
    sectionName: "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
    status: "active",
  },
  {
    id: 7,
    sectionName: "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
    status: "active",
  },
  {
    id: 8,
    sectionName: "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
    status: "inactive",
  },
];

// Table columns
const columns: Column<SectionRowData>[] = [
  {
    key: "sectionName",
    header: "اسم المقطع",
    render: (row) => (
      <div className="flex items-center gap-2">
        <FileText className="size-4 text-gray-500" />
        <span>{row.sectionName}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "الحالة",
    render: (row) => {
      return row.status === "active" ? (
        <Badge variant="success" className="px-3 py-1">
          مفعل
        </Badge>
      ) : (
        <Badge variant="destructive" className="px-3 py-1">
          غير مفعل
        </Badge>
      );
    },
  },
  {
    key: "options",
    header: "الخيارات",
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
              console.log("Edit section:", row.id);
              // Handle edit action
            }}
          >
            <Edit className="size-4 ml-2" />
            تعديل
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              console.log("Delete section:", row.id);
              // Handle delete action
            }}
          >
            <Trash2 className="size-4 ml-2" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function SectionOptionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-4">
      {/* Table Section */}
      <DataTable
        data={tableData}
        columns={columns}
        emptyMessage="لا توجد بيانات للعرض"
      />

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
