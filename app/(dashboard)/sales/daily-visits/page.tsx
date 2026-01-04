"use client";

import { useState, useMemo, useCallback } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  FilterField,
} from "../../../../components/shared/filter-sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShowroomVisits, useUpdateShowroomVisitStatus } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Data interface
export interface DailyVisitRowData {
  id: number;
  customerName: string;
  location: string;
  phone: string;
  date: string;
  status: string;
  notes: string | null;
  salesUser?: string;
  hasForm?: boolean;
}

// Helper function to format date from API format (YYYY-MM-DD) to display format
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


export default function DailyVisitsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const queryClient = useQueryClient();
  const updateStatusMutation = useUpdateShowroomVisitStatus();

  // Fetch showroom visits from API
  const { data: visitsData, isLoading, error } = useShowroomVisits({
    page: currentPage,
    per_page: pageSize,
  });

  // Convert API data to TableRowData format
  const tableData = useMemo(() => {
    if (!visitsData?.data) return [];

    return visitsData.data.map((visit) => ({
      id: visit.id,
      customerName: visit.customer_name,
      location: visit.location,
      phone: visit.phone,
      date: formatDate(visit.visit_date),
      status: visit.status,
      notes: visit.notes,
      salesUser: visit.sales_user?.name || "",
      hasForm: visit.has_form,
    }));
  }, [visitsData]);

  // Handle status click
  const handleStatusClick = useCallback((visitId: number, currentStatus: string, currentNotes: string | null) => {
    setSelectedVisitId(visitId);
    setSelectedStatus(currentStatus);
    setNotes(currentNotes || "");
    setStatusDialogOpen(true);
  }, []);

  // Table columns
  const columns: Column<DailyVisitRowData>[] = useMemo(() => [
    {
      key: "customerName",
      header: "اسم الزبون",
    },
    {
      key: "location",
      header: "الموقع",
    },
    {
      key: "phone",
      header: "رقم الهاتف",
    },
    {
      key: "salesUser",
      header: "المندوب",
      render: (row) => row.salesUser || "-",
    },
    {
      key: "date",
      header: "التاريخ",
    },
    {
      key: "status",
      header: "الحالة",
      render: (row) => {
        // Map API status to display labels
        const statusConfig: Record<string, { label: string; variant: "success" | "destructive" | "warning" | "default" | "outline" }> = {
          sections_explained: {
            label: "تم شرح المقاطع",
            variant: "default",
          },
          contract_signed: {
            label: "تم توقيع العقد",
            variant: "success",
          },
          // Add more status mappings as needed
        };

        const config = statusConfig[row.status] || {
          label: row.status,
          variant: "outline" as const,
        };

        return (
          <button 
            className="cursor-pointer"
            onClick={() => handleStatusClick(row.id, row.status, row.notes)}
          >
            <Badge variant={config.variant} className="px-3 py-1">
              {config.label}
            </Badge>
          </button>
        );
      },
    },
    {
      key: "notes",
      header: "الملاحظات",
      render: (row) => row.notes || "-",
    },
  ], [handleStatusClick]);

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Handle status update submit
  const handleStatusUpdate = async () => {
    if (!selectedVisitId || !selectedStatus) return;

    try {
      const requestBody: {
        status: string;
        notes?: string;
      } = {
        status: selectedStatus,
      };

      if (notes.trim()) {
        requestBody.notes = notes.trim();
      }

      await updateStatusMutation.mutateAsync({
        id: selectedVisitId,
        data: requestBody,
      });

      // Invalidate showroom visits query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["showroom-visits"] });

      toast.success("تم تحديث الحالة بنجاح");
      
      // Close dialog
      setStatusDialogOpen(false);
      setSelectedVisitId(null);
      setSelectedStatus("");
      setNotes("");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("فشل تحديث الحالة. يرجى المحاولة مرة أخرى");
    }
  };

  // Handle dialog close
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setSelectedVisitId(null);
    setSelectedStatus("");
    setNotes("");
  };

  // Define filter fields for daily visits
  const filterFields: FilterField[] = [
    {
      key: "customerName",
      label: "اسم الزبون",
      type: "input",
      placeholder: "اسم الزبون",
    },
    {
      key: "status",
      label: "الحالة",
      type: "select",
      placeholder: "أختر المندوب من القائمة",
      options: [
        { value: "completed", label: "تم أخذ القياس" },
        { value: "not-completed", label: "لم يتم أخذ القياس" },
        { value: "postponed", label: "مؤجل" },
      ],
    },
    {
      key: "delegate",
      label: "المندوب",
      type: "select",
      placeholder: "أختر المندوب من القائمة",
      options: [
        { value: "rep1", label: "مندوب 1" },
        { value: "rep2", label: "مندوب 2" },
      ],
    },
    {
      key: "date",
      label: "التاريخ",
      type: "date",
      placeholder: "__/__/____",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-4">
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
            columns={columns}
            emptyMessage="لا توجد بيانات للعرض"
            enableFilter
            filterFields={filterFields}
            initialFilters={appliedFilters}
            onApplyFilters={handleApplyFilters}
          />

          {/* Pagination */}
          {visitsData?.meta && (
            <TablePagination
              currentPage={visitsData.meta.current_page}
              totalPages={visitsData.meta.last_page}
              pageSize={visitsData.meta.per_page}
              totalItems={visitsData.meta.total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تغيير الحالة</DialogTitle>
            <DialogDescription>
              قم بتحديث حالة وملاحظات زيارة المعرض
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5">
            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status-select">الحالة</Label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sections_explained">تم شرح المقاطع</SelectItem>
                  <SelectItem value="contract_signed">تم توقيع العقد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">الملاحظات</Label>
              <Textarea
                id="notes"
                placeholder="ادخل الملاحظات هنا"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleStatusDialogClose}
                disabled={updateStatusMutation.isPending}
              >
                الغاء
              </Button>
              <Button
                type="button"
                className="bg-[#0A3158] text-white hover:bg-[#0A3158]/90"
                onClick={handleStatusUpdate}
                disabled={updateStatusMutation.isPending || !selectedStatus}
              >
                {updateStatusMutation.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

