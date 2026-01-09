import { useMemo } from "react";
import { Column } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { useDateConverter } from "../../../../hooks/use-date-converter";
import { MovementStatus } from "./use-daily-movement-status";
import { DailyMovementsListResponse } from "@/services/sales/sales-services";

// Data interface
export interface DailyMovementRowData {
  id: number;
  location: string;
  customerName: string;
  phone: string;
  notes: string;
  date: string;
  status: MovementStatus;
  salesUser?: string;
  followUpDate?: string | null;
  isPostponed?: boolean;
  isDueFollowUp?: boolean;
}

/**
 * Custom hook for transforming and managing daily movement table data
 */
export function useDailyMovementTable(
  movementsData: DailyMovementsListResponse | undefined,
  onStatusClick: (movementId: number, status: MovementStatus) => void
): { tableData: DailyMovementRowData[]; columns: Column<DailyMovementRowData>[] } {
  const { formatDate } = useDateConverter();

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
      isPostponed: false, // Not provided in API response
      isDueFollowUp: movement.is_due_follow_up,
    }));
  }, [movementsData, formatDate]);

  // Table columns
  const columns: Column<DailyMovementRowData>[] = useMemo(
    () => [
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
        render: (row) => (row.followUpDate ? formatDate(row.followUpDate) : "-"),
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
            not_measured: {
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
              onClick={() => onStatusClick(row.id, row.status)}
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
        render: (row) =>
          row.isDueFollowUp ? (
            <Badge variant="warning" className="px-3 py-1">
              نعم
            </Badge>
          ) : (
            <span className="text-muted-foreground">لا</span>
          ),
      },
    ],
    [formatDate, onStatusClick]
  );

  return {
    tableData,
    columns,
  };
}
