"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Eye, Edit, Download, FileText, Ruler, Table2 } from "lucide-react";
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

export default function DescriptionsPage() {
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

  // Define filter fields for descriptions
  const filterFields: FilterField[] = [
    {
      key: "serialNumber",
      label: "الرقم التسلسلي",
      type: "input",
      placeholder: "الرقم التسلسلي",
    },
    {
      key: "status",
      label: "الحالة",
      type: "select",
      placeholder: "اختر الحالة",
      options: [
        { value: "pending", label: "قيد الانتظار" },
        { value: "signed", label: "تم توقيع الوصف" },
      ],
    },
  ];

  // Handlers for view actions
  const handleViewContract = (descriptionNumber: string) => {
    console.log("View contract for:", descriptionNumber);
    // TODO: Navigate to contract view or open contract dialog
  };

  const handleViewMeasurements = (descriptionNumber: string) => {
    console.log("View measurements for:", descriptionNumber);
    // TODO: Navigate to measurements view or open measurements dialog
  };

  const handleViewEvaluationTable = (descriptionNumber: string) => {
    console.log("View evaluation table for:", descriptionNumber);
    // TODO: Navigate to evaluation table view or open evaluation dialog
  };

  const handleEditDescription = (descriptionNumber: string) => {
    console.log("Edit description:", descriptionNumber);
    // TODO: Navigate to edit description page
    // router.push(`/projects/descriptions/edit/${descriptionNumber}`);
  };

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
          <Badge variant="warning" className="px-3 py-1">
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
              عرض الوصف
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEditDescription(row.descriptionNumber)}
            >
              <Edit className="size-4 ml-2" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleViewContract(row.descriptionNumber)}
            >
              <FileText className="size-4 ml-2" />
              عرض العقد
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleViewMeasurements(row.descriptionNumber)}
            >
              <Ruler className="size-4 ml-2" />
              عرض القياسات
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleViewEvaluationTable(row.descriptionNumber)}
            >
              <Table2 className="size-4 ml-2" />
              عرض جدول تقييم الأعمال
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

