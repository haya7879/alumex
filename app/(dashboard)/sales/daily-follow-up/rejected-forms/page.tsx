"use client";

import { DataTable, Column } from "@/components/table/data-table";
import { TableRowData } from "@/app/(dashboard)/sales/_components/columns";
import { FilterField } from "@/components/shared/filter-sheet";
import { TablePagination } from "@/components/table";
import { useState } from "react";
import {
  FileText,
  Menu,
  Eye,
  Edit,
  X,
  FileDown,
  CheckCircle2,
  MoreVerticalIcon,
} from "lucide-react";
import { FaFileAlt, FaCopy } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Sample follow-up notes data
interface FollowUpNote {
  text: string;
  date: string;
  employeeName: string;
}

// Sample data for follow-up notes (in real app, this would come from API)
const sampleFollowUpNotes: Record<number, FollowUpNote[]> = {
  0: [
    {
      text: "تم رفض العرض بسبب السعر المرتفع",
      date: "16/8/2025",
      employeeName: "أحمد محمد",
    },
    {
      text: "العميل طلب عرض سعر جديد",
      date: "17/8/2025",
      employeeName: "سارة علي",
    },
  ],
  1: [
    {
      text: "تم رفض العرض بسبب عدم توفر المنتج",
      date: "21/8/2025",
      employeeName: "محمد خالد",
    },
  ],
};

// Sample data for rejected forms
const tableData: TableRowData[] = [
  {
    customerName: "شركة الرفض 1",
    phone: "07 123456789",
    serialNumber: "2302-2897",
    lastOfferDate: "15/8/2525",
    lastOfferPrice: "300,000",
    receivedOffer: "نعم",
    response: "مرفوض",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة الرفض 2",
    phone: "07 987654321",
    serialNumber: "3427-9169",
    lastOfferDate: "20/8/2525",
    lastOfferPrice: "250,000",
    receivedOffer: "لا",
    response: "مرفوض",
    followUp: { origin: "green" as const, branch: "blue" },
  },
];

export default function RejectedFormsPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const [hoveredPopoverIndex, setHoveredPopoverIndex] = useState<number | null>(
    null
  );

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
  };

  const handleView = (index: number) => {
    // TODO: Navigate to view page
    console.log("View item:", index);
  };

  const handleEdit = (
    section: "basic" | "followup" | "measurements",
    index: number
  ) => {
    // TODO: Navigate to edit page with section
    console.log("Edit", section, "for item:", index);
  };

  const handleReject = (index: number) => {
    // TODO: Handle reject action
    console.log("Reject item:", index);
  };

  const handleCreatePriceOffer = (index: number) => {
    // TODO: Create price offer PDF
    console.log("Create price offer for item:", index);
  };

  const handleContractSigned = (index: number) => {
    // TODO: Handle contract signed action
    console.log("Contract signed for item:", index);
  };

  // Custom columns for rejected forms with follow-up and origin/branch
  const rejectedFormsColumns: Column<TableRowData>[] = [
    {
      key: "customerName",
      header: "اسم الزبون",
    },
    {
      key: "phone",
      header: "رقم الهاتف",
    },
    {
      key: "lastOfferDate",
      header: "اخر عرض سعر",
    },
    {
      key: "lastOfferPrice",
      header: "سعر اخر عرض",
      render: (row: TableRowData) => row.lastOfferPrice || "-",
    },
    {
      key: "receivedOffer",
      header: "هل استلم العرض",
    },
    {
      key: "response",
      header: "الرد",
      render: (row: TableRowData) => row.response || "-",
    },
    {
      key: "followUp",
      header: "المتابعة",
      render: (row: TableRowData, index: number) => (
        <Popover
          open={hoveredPopoverIndex === index}
          onOpenChange={(open) =>
            setHoveredPopoverIndex(open ? index : null)
          }
        >
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-1 text-xs font-medium hover:text-primary transition-colors"
              onMouseEnter={() => setHoveredPopoverIndex(index)}
            >
              <FileText className="size-4" />
              <span>برنامج المتابعة</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80"
            align="start"
            onMouseEnter={() => setHoveredPopoverIndex(index)}
            onMouseLeave={() => setHoveredPopoverIndex(null)}
          >
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">ملاحظات المتابعة</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(sampleFollowUpNotes[index] || []).length > 0 ? (
                  sampleFollowUpNotes[index].map((note, noteIndex) => (
                    <div key={noteIndex} className="border-b pb-2 last:border-0">
                      <p className="text-sm mb-3">{note.text}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{note.employeeName}</span>
                        <span>{note.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد ملاحظات</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      key: "originBranch",
      header: "أصل / فرع",
      render: (row: TableRowData) => (
        <div
          className="flex items-center gap-1"
          title={row.followUp.origin === "blue" ? "نسخة أصلية" : "نسخة مكررة"}
        >
          {row.followUp.origin === "blue" ? (
            <FaFileAlt className="text-base text-blue-500" />
          ) : (
            <FaCopy className="text-base text-green-500" />
          )}
          <span className="text-sm font-medium">
            {row.followUp.origin === "blue" ? "أصل" : "مكرر"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row: TableRowData, index: number) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className=""
            >
              <MoreVerticalIcon className="size-4 text-[#3675AF] dark:text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                تعديل
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleEdit("basic", index)}>
                  المعلومات الأساسية
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit("followup", index)}>
                  برنامج المتابعة
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleEdit("measurements", index)}
                >
                  القياسات
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => handleReject(index)}
              variant="destructive"
            >
              رفض
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreatePriceOffer(index)}>
              إنشاء عرض سعر
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleContractSigned(index)}>
              <CheckCircle2 className="size-4 ml-2" />
              تم توقيع العقد
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
    <>
      <DataTable
        data={tableData}
        columns={rejectedFormsColumns}
        emptyMessage="لا توجد بيانات للعرض"
        enableFilter
        filterFields={filterFields}
        initialFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
      />
      <TablePagination
        currentPage={1}
        totalPages={1}
        pageSize={10}
        totalItems={2}
        onPageChange={() => {}}
      />
    </>
  );
}
