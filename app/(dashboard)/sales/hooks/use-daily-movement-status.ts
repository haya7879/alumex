import { useState } from "react";
import { useUpdateDailyMovementStatus } from "@/services/sales/sales-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDateConverter } from "@/hooks/use-date-converter";

export type MovementStatus = "measured" | "not_measured" | "postponed";

interface UseDailyMovementStatusReturn {
  isDialogOpen: boolean;
  selectedMovementId: number | null;
  selectedStatus: MovementStatus | "";
  followUpDate: string;
  isPending: boolean;
  openDialog: (movementId: number) => void;
  closeDialog: () => void;
  setSelectedStatus: (status: MovementStatus) => void;
  setFollowUpDate: (date: string) => void;
  updateStatus: () => Promise<void>;
}

/**
 * Custom hook for managing daily movement status updates
 * Handles dialog state, status selection, and API calls
 */
export function useDailyMovementStatus(): UseDailyMovementStatusReturn {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMovementId, setSelectedMovementId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<MovementStatus | "">("");
  const [followUpDate, setFollowUpDate] = useState("");

  const queryClient = useQueryClient();
  const updateStatusMutation = useUpdateDailyMovementStatus();
  const { convertDateToAPIFormat } = useDateConverter();

  const openDialog = (movementId: number) => {
    setSelectedMovementId(movementId);
    setSelectedStatus("");
    setFollowUpDate("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedMovementId(null);
    setSelectedStatus("");
    setFollowUpDate("");
  };

  const updateStatus = async () => {
    if (!selectedMovementId || !selectedStatus) return;

    if (selectedStatus === "postponed" && !followUpDate.trim()) {
      toast.error("يرجى إدخال تاريخ المتابعة");
      return;
    }

    try {
      const requestBody: {
        status: MovementStatus;
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
      closeDialog();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("فشل تحديث الحالة. يرجى المحاولة مرة أخرى");
    }
  };

  return {
    isDialogOpen,
    selectedMovementId,
    selectedStatus,
    followUpDate,
    isPending: updateStatusMutation.isPending,
    openDialog,
    closeDialog,
    setSelectedStatus,
    setFollowUpDate,
    updateStatus,
  };
}
