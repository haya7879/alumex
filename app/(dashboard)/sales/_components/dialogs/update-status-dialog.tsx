"use client";

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
import { Calendar } from "lucide-react";

export interface StatusOption {
  value: string;
  label: string;
}

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  selectedStatus: string;
  statusOptions: StatusOption[];
  isPending: boolean;
  onStatusSelect: (status: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  // Optional follow-up date field (for daily-movement)
  followUpDate?: string;
  onFollowUpDateChange?: (date: string) => void;
  showFollowUpDate?: boolean | ((status: string) => boolean);
  // Optional notes field (for daily-visits)
  notes?: string;
  onNotesChange?: (notes: string) => void;
  showNotes?: boolean;
}

export function UpdateStatusDialog({
  open,
  onOpenChange,
  title = "تغيير الحالة",
  description = "اختر الحالة الجديدة",
  selectedStatus,
  statusOptions,
  isPending,
  onStatusSelect,
  onConfirm,
  onCancel,
  followUpDate = "",
  onFollowUpDateChange,
  showFollowUpDate = false,
  notes = "",
  onNotesChange,
  showNotes = false,
}: UpdateStatusDialogProps) {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  // Determine if follow-up date should be shown
  const shouldShowFollowUpDate =
    typeof showFollowUpDate === "function"
      ? showFollowUpDate(selectedStatus)
      : showFollowUpDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status-select">الحالة</Label>
            <Select value={selectedStatus} onValueChange={onStatusSelect}>
              <SelectTrigger id="status-select">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Follow Up Date - Conditional display */}
          {shouldShowFollowUpDate && (
            <div className="space-y-2">
              <Label htmlFor="followUpDate">تاريخ المتابعة</Label>
              <Input
                id="followUpDate"
                type="text"
                placeholder="----/--/--"
                icon={Calendar}
                value={followUpDate}
                onChange={(e) => onFollowUpDateChange?.(e.target.value)}
              />
            </div>
          )}

          {/* Notes - Conditional display */}
          {showNotes && (
            <div className="space-y-2">
              <Label htmlFor="notes">الملاحظات</Label>
              <Textarea
                id="notes"
                placeholder="ادخل الملاحظات هنا"
                value={notes}
                onChange={(e) => onNotesChange?.(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              الغاء
            </Button>
            <Button
              type="button"
              className="bg-[#0A3158] text-white hover:bg-[#0A3158]/90"
              onClick={onConfirm}
              disabled={isPending || !selectedStatus}
            >
              {isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
