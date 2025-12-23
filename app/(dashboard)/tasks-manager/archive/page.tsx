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
export interface ArchiveTaskRowData {
  taskName: string;
  projectName: string;
  endDate: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "completed";
}

// Sample data for archived tasks (all completed)
const tableData: ArchiveTaskRowData[] = [
  {
    taskName: "التاكيد على اله تم عمل تشك على الموقع المحدد",
    projectName: "شركة اليد للبناء",
    endDate: "__/__/____",
    priority: "HIGH",
    status: "completed",
  },
  {
    taskName: "التاكيد على اله تم عمل تشك على الموقع المحدد",
    projectName: "شركة اليد للبناء",
    endDate: "__/__/____",
    priority: "MEDIUM",
    status: "completed",
  },
  {
    taskName: "التاكيد على اله تم عمل تشك على الموقع المحدد",
    projectName: "شركة اليد للبناء",
    endDate: "__/__/____",
    priority: "LOW",
    status: "completed",
  },
  {
    taskName: "التاكيد على اله تم عمل تشك على الموقع المحدد",
    projectName: "شركة اليد للبناء",
    endDate: "__/__/____",
    priority: "MEDIUM",
    status: "completed",
  },
  {
    taskName: "التاكيد على اله تم عمل تشك على الموقع المحدد",
    projectName: "شركة اليد للبناء",
    endDate: "__/__/____",
    priority: "MEDIUM",
    status: "completed",
  },
  {
    taskName: "التاكيد على اله تم عمل تشك على الموقع المحدد",
    projectName: "شركة اليد للبناء",
    endDate: "__/__/____",
    priority: "MEDIUM",
    status: "completed",
  },
  {
    taskName: "التاكيد على اله تم عمل تشك على الموقع المحدد",
    projectName: "شركة اليد للبناء",
    endDate: "__/__/____",
    priority: "MEDIUM",
    status: "completed",
  },
];

// Table columns
const columns: Column<ArchiveTaskRowData>[] = [
  {
    key: "taskName",
    header: "اسم المهمة",
  },
  {
    key: "projectName",
    header: "اسم المشروع",
  },
  {
    key: "endDate",
    header: "تاريخ الانتهاء",
  },
  {
    key: "priority",
    header: "الأولوية",
    render: (row) => {
      const priorityColors = {
        HIGH: "text-red-600",
        MEDIUM: "text-blue-600",
        LOW: "text-green-600",
      };
      return (
        <span className={`font-medium ${priorityColors[row.priority]}`}>
          {row.priority}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "الحالة",
    render: () => {
      return (
        <Badge variant="success" className="px-3 py-1">
          مكتملة
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

export default function ArchiveTasksPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for archived tasks
  const filterFields: FilterField[] = [
    {
      key: "task",
      label: "المهمة",
      type: "input",
      placeholder: "ابحث عن اسم المهمة",
    },
    {
      key: "project",
      label: "المشروع",
      type: "select",
      placeholder: "اختر المشروع من القائمة",
      options: [
        { value: "project1", label: "شركة اليد للبناء" },
        { value: "project2", label: "مشروع 2" },
        { value: "project3", label: "مشروع 3" },
      ],
    },
    {
      key: "date",
      label: "التاريخ",
      type: "select",
      placeholder: "اختر التاريخ من القائمة",
      options: [
        { value: "today", label: "اليوم" },
        { value: "week", label: "هذا الأسبوع" },
        { value: "month", label: "هذا الشهر" },
      ],
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
