"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Eye, Edit, Download } from "lucide-react";
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
export interface DescriptionRowData {
  projectName: string;
  phone: string;
  remainingDays: string;
  followUp: string;
  descriptionDate: string;
  descriptionNumber: string;
  status: "pending" | "signed";
}

// Sample data based on the image
const tableData: DescriptionRowData[] = [
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "-",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "pending",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "-",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "pending",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "-",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "pending",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "9 يوم",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "signed",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "9 يوم",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "signed",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "9 يوم",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "signed",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "9 يوم",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "signed",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "9 يوم",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "signed",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "9 يوم",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "signed",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "9 يوم",
    followUp: "لهيب لهيب",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "signed",
  },
  {
    projectName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    remainingDays: "9 يوم",
    followUp: "فاطمة اسماعيل",
    descriptionDate: "23/2/2025",
    descriptionNumber: "K7384924",
    status: "signed",
  },
];

// Table columns
const columns: Column<DescriptionRowData>[] = [
  {
    key: "projectName",
    header: "اسم المشروع",
  },
  {
    key: "phone",
    header: "رقم الهاتف",
  },
  {
    key: "remainingDays",
    header: "عدد الأيام المتبقي",
  },
  {
    key: "followUp",
    header: "المتابعة",
  },
  {
    key: "descriptionDate",
    header: "تاريخ الوصف",
  },
  {
    key: "descriptionNumber",
    header: "رقم الوصف",
  },
  {
    key: "status",
    header: "الحالة",
    render: (row) => {
      return row.status === "pending" ? (
        <Badge variant="default" className="px-3 py-1 bg-blue-600 text-white">
          قيد الانتظار
        </Badge>
      ) : (
        <Badge variant="success" className="px-3 py-1">
          تم توقيع الوصف
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
            onClick={() => {
              console.log("View description:", row.descriptionNumber);
              // Handle view action
            }}
          >
            <Eye className="size-4 ml-2" />
            عرض
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              console.log("Edit description:", row.descriptionNumber);
              // Handle edit action
            }}
          >
            <Edit className="size-4 ml-2" />
            تعديل
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              console.log("Download PDF:", row.descriptionNumber);
              // Handle download PDF action
            }}
          >
            <Download className="size-4 ml-2" />
            تنزيل PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function DescriptionsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({
    serialNumber: "K5430",
  });

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for descriptions
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
      key: "serialNumber",
      label: "الرقم التسلسلي",
      type: "input",
      placeholder: "الرقم التسلسلي",
      defaultValue: "K5430",
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
        totalPages={5}
        pageSize={10}
        totalItems={tableData.length}
        onPageChange={() => {}}
      />
    </div>
  );
}

