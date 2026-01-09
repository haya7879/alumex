"use client";

import { useState, useMemo } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import {
  FilterField,
} from "../../../../components/shared/filter-sheet";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useDailyMovements, useUpdateDailyMovementStatus } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Data interface
export interface DailyMovementRowData {
  id: number;
  location: string;
  customerName: string;
  phone: string;
  notes: string;
  date: string;
  status: "measured" | "not_measured" | "postponed";
  salesUser?: string;
  followUpDate?: string | null;
  isPostponed?: boolean;
  isDueFollowUp?: boolean;
  options?: React.ReactNode;
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


export default function DailyMovementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedMovementId, setSelectedMovementId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"measured" | "not_measured" | "postponed" | "">("");
  const [followUpDate, setFollowUpDate] = useState("");

  const queryClient = useQueryClient();
  const updateStatusMutation = useUpdateDailyMovementStatus();

  // Fetch daily movements from API
  const { data: movementsData, isLoading, error } = useDailyMovements({
    page: currentPage,
    per_page: pageSize,
  });

  // Convert API data to TableRowData format
  const tableData = useMemo(() => {
    if (!movementsData?.data) return [];

    return movementsData.data.map((movement) => ({
      id: movement.id,
      location: movement.location,
      customerName: movement.customer_name,
      phone: movement.phone,
      notes: movement.follow_up_date ? formatDate(movement.follow_up_date) : "_/_/_/_",
      date: formatDate(movement.movement_date),
      status: movement.status,
      salesUser: movement.sales_user?.name || "",
      followUpDate: movement.follow_up_date,
      isPostponed: movement.is_postponed,
      isDueFollowUp: movement.is_due_follow_up,
    }));
  }, [movementsData]);

  // Table columns
  const columns: Column<DailyMovementRowData>[] = useMemo(() => [
    {
      key: "location",
      header: "الموقع",
    },
    {
      key: "customerName",
      header: "اسم الزبون",
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
      key: "followUpDate",
      header: "تاريخ المتابعة",
      render: (row) => row.followUpDate ? formatDate(row.followUpDate) : "-",
    },
    {
      key: "movement_date",
      header: "تاريخ الحركة",
      render: (row) => row.date,
    },
    {
      key: "status",
      header: "الحالة",
      render: (row) => {
        const statusConfig = {
          measured: {
            label: "تم أخذ القياس",
            variant: "success" as const,
          },
          "not_measured": {
            label: "لم يتم أخذ القياس",
            variant: "destructive" as const,
          },
          postponed: {
            label: "مؤجل",
            variant: "warning" as const,
          },
        };

        const config = statusConfig[row.status];

        return (
          <button 
            className="cursor-pointer"
            onClick={() => handleStatusClick(row.id, row.status)}
          >
            <Badge variant={config.variant} className="px-3 py-1">
              {config.label}
            </Badge>
          </button>
        );
      },
    },
    {
      key: "isDueFollowUp",
      header: "يحتاج متابعة",
      render: (row) => (
        row.isDueFollowUp ? (
          <Badge variant="warning" className="px-3 py-1">
            نعم
          </Badge>
        ) : (
          <span className="text-muted-foreground">لا</span>
        )
      ),
    },
    // {
    //   key: "options",
    //   header: "الخيارات",
    //   render: () => (
    //     <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    //   ),
    // },
  ], []);

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Handle status click
  const handleStatusClick = (movementId: number, currentStatus: "measured" | "not_measured" | "postponed") => {
    setSelectedMovementId(movementId);
    setSelectedStatus("");
    setFollowUpDate("");
    setStatusDialogOpen(true);
  };

  // Handle status selection from dropdown
  const handleStatusSelect = (status: "measured" | "not_measured" | "postponed") => {
    setSelectedStatus(status);
    if (status !== "postponed") {
      setFollowUpDate("");
    }
  };

  // Handle status update submit
  const handleStatusUpdate = async () => {
    if (!selectedMovementId || !selectedStatus) return;

    if (selectedStatus === "postponed" && !followUpDate.trim()) {
      toast.error("يرجى إدخال تاريخ المتابعة");
      return;
    }

    try {
      // Convert date from DD/MM/YYYY to YYYY-MM-DD
      const convertDateToAPIFormat = (dateString: string): string => {
        if (!dateString) return "";
        const parts = dateString.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return dateString;
      };

      const requestBody: {
        status: "measured" | "not_measured" | "postponed";
        follow_up_date?: string;
      } = {
        status: selectedStatus,
      };

      if (selectedStatus === "postponed" && followUpDate.trim()) {
        requestBody.follow_up_date = convertDateToAPIFormat(followUpDate);
      }

      await updateStatusMutation.mutateAsync({
        id: selectedMovementId,
        data: requestBody,
      });

      // Invalidate daily movements query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["daily-movements"] });

      toast.success("تم تحديث الحالة بنجاح");
      
      // Close dialog
      setStatusDialogOpen(false);
      setSelectedMovementId(null);
      setSelectedStatus("");
      setFollowUpDate("");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("فشل تحديث الحالة. يرجى المحاولة مرة أخرى");
    }
  };

  // Handle dialog close
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setSelectedMovementId(null);
    setSelectedStatus("");
    setFollowUpDate("");
  };


  // Define filter fields for daily movement
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
        { value: "measured", label: "تم أخذ القياس" },
        { value: "not_measured", label: "لم يتم أخذ القياس" },
        { value: "postponed", label: "مؤجل" },
      ],
    },
    {
      key: "representative",
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
            enableFilter
            filterFields={filterFields}
            initialFilters={appliedFilters}
            onApplyFilters={handleApplyFilters}
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
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تغيير الحالة</DialogTitle>
            <DialogDescription>
              اختر الحالة الجديدة للحركة اليومية
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5">
            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status-select">الحالة</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {selectedStatus === "measured" && "تم أخذ القياس"}
                    {selectedStatus === "not_measured" && "لم يتم أخذ القياس"}
                    {selectedStatus === "postponed" && "مؤجل"}
                    {!selectedStatus && "اختر الحالة"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full">
                  <DropdownMenuItem onClick={() => handleStatusSelect("measured")}>
                    تم أخذ القياس
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusSelect("not_measured")}>
                    لم يتم أخذ القياس
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusSelect("postponed")}>
                    مؤجل
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Follow Up Date - Only show if status is postponed */}
            {selectedStatus === "postponed" && (
              <div className="space-y-2">
                <Label htmlFor="followUpDate">تاريخ المتابعة</Label>
                <Input
                  id="followUpDate"
                  type="text"
                  placeholder="----/--/--"
                  icon={Calendar}
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
            )}

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
    </>
  );
}
