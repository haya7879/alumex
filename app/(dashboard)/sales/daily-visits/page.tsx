"use client";

import { useState, useMemo, useCallback } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { useShowroomVisits, useUpdateShowroomVisitStatus } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateStatusDialog } from "../_components/dialogs/update-status-dialog";
import { useDateConverter } from "@/hooks/use-date-converter";

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


export default function DailyVisitsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const queryClient = useQueryClient();
  const updateStatusMutation = useUpdateShowroomVisitStatus();
  const { formatDate } = useDateConverter();

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
  }, [visitsData, formatDate]);

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
      <UpdateStatusDialog
        open={statusDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleStatusDialogClose();
        }}
        title="تغيير الحالة"
        description="قم بتحديث حالة وملاحظات زيارة المعرض"
        selectedStatus={selectedStatus}
        statusOptions={[
          { value: "sections_explained", label: "تم شرح المقاطع" },
          { value: "contract_signed", label: "تم توقيع العقد" },
        ]}
        isPending={updateStatusMutation.isPending}
        onStatusSelect={setSelectedStatus}
        notes={notes}
        onNotesChange={setNotes}
        showNotes={true}
        onConfirm={handleStatusUpdate}
        onCancel={handleStatusDialogClose}
      />
    </div>
  );
}

