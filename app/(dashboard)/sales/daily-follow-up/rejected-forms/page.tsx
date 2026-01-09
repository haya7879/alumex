"use client";

import { DataTable, Column } from "@/components/table/data-table";
import { TableRowData } from "@/app/(dashboard)/sales/_components/columns/columns";
import { FilterField } from "@/components/shared/filter-sheet";
import { TablePagination } from "@/components/table";
import { useState, useMemo } from "react";
import {
  FileText,
} from "lucide-react";
import { FaFileAlt, FaCopy } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRejectedForms } from "@/services/sales/sales-hooks";
import { RejectedFormData } from "@/services/sales/sales-services";
import { useDateConverter } from "@/hooks/use-date-converter";

interface FollowUpNote {
  text: string;
  date: string;
  employeeName: string;
}

const sampleFollowUpNotes: Record<number, FollowUpNote[]> = {};

export default function RejectedFormsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const [hoveredPopoverIndex, setHoveredPopoverIndex] = useState<number | null>(
    null
  );

  // Date converter hook
  const { formatDate } = useDateConverter();

  // Fetch rejected forms from API
  const { data: rejectedFormsData, isLoading, error } = useRejectedForms({
    page: currentPage,
    per_page: pageSize,
  });

  // Convert API data to TableRowData format
  const tableData = useMemo(() => {
    if (!rejectedFormsData?.data) return [];

    return rejectedFormsData.data.map((form: RejectedFormData) => ({
      id: form.id,
      customerName: form.form_name,
      phone: "-", // Not available in API response
      serialNumber: form.serials.current,
      lastOfferDate: form.entry_date ? formatDate(form.entry_date) : "-",
      lastOfferPrice: form.quotation && form.quotation.total_value != null
        ? Number(form.quotation.total_value).toLocaleString()
        : "-",
      receivedOffer: "-", // Not available in API response
      response: "مرفوض",
      followUp: {
        origin: form.serials.parent ? ("green" as const) : ("blue" as const),
        branch: form.serials.parent ? "مكرر" : "أصل",
      },
      formData: form, // Store full form data for use in handlers
    }));
  }, [rejectedFormsData, formatDate]);

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Reset to first page when filters are applied
    setCurrentPage(1);
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
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          جاري التحميل...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-muted-foreground">
          حدث خطأ أثناء تحميل البيانات
        </div>
      )}

      {/* Table Section */}
      {!isLoading && !error && (
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
          {rejectedFormsData?.meta && (
            <TablePagination
              currentPage={rejectedFormsData.meta.current_page}
              totalPages={rejectedFormsData.meta.last_page}
              pageSize={rejectedFormsData.meta.per_page}
              totalItems={rejectedFormsData.meta.total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}
    </>
  );
}
