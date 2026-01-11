"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { FilterField } from "../../../../components/shared/filter-sheet";
import { TablePagination } from "@/components/table";
import { Calendar } from "lucide-react";
import { useDailyMovements } from "@/services/sales/sales-hooks";
import { useDailyMovementStatus } from "@/app/(dashboard)/sales/hooks/use-daily-movement-status";
import { useDailyMovementTable } from "@/app/(dashboard)/sales/hooks/use-daily-movement-table";
import { UpdateStatusDialog, StatusOption } from "../_components/dialogs/update-status-dialog";
export type { DailyMovementRowData } from "@/app/(dashboard)/sales/hooks/use-daily-movement-table";


export default function DailyMovementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");

  // Hooks
  const statusHook = useDailyMovementStatus();
  const { data: movementsData, isLoading, error } = useDailyMovements({
    page: currentPage,
    per_page: pageSize,
  });
  const { tableData, columns } = useDailyMovementTable(
    movementsData,
    (movementId, status) => statusHook.openDialog(movementId)
  );

  const handleStatusSelect = (status: string) => {
    statusHook.setSelectedStatus(status as "measured" | "not_measured" | "postponed");
    if (status !== "postponed") {
      statusHook.setFollowUpDate("");
    }
  };

  const statusOptions: StatusOption[] = [
    { value: "measured", label: "تم أخذ القياس" },
    { value: "not_measured", label: "لم يتم أخذ القياس" },
    { value: "postponed", label: "مؤجل" },
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
            columns={columns}
            emptyMessage="لا توجد بيانات للعرض"
            enableExport
            exportFilename="daily-movement"
            enableSearch
            searchValue={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              console.log("Search Query:", value);
            }}
            searchPlaceholder="Search"
            searchWidth="250px"
          />

          {/* Pagination */}
          {movementsData?.meta && (
            <TablePagination
              currentPage={movementsData.meta.current_page}
              totalPages={movementsData.meta.last_page}
              pageSize={movementsData.meta.per_page}
              totalItems={movementsData.meta.total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}

      {/* Status Update Dialog */}
      <UpdateStatusDialog
        open={statusHook.isDialogOpen}
        onOpenChange={(open) => {
          if (!open) statusHook.closeDialog();
        }}
        title="تغيير الحالة"
        description="اختر الحالة الجديدة للحركة اليومية"
        selectedStatus={statusHook.selectedStatus}
        statusOptions={statusOptions}
        isPending={statusHook.isPending}
        onStatusSelect={handleStatusSelect}
        followUpDate={statusHook.followUpDate}
        onFollowUpDateChange={statusHook.setFollowUpDate}
        showFollowUpDate={(status) => status === "postponed"}
        onConfirm={statusHook.updateStatus}
        onCancel={statusHook.closeDialog}
      />
    </>
  );
}
