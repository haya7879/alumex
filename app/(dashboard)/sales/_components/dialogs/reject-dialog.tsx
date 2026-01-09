"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void | Promise<void>;
  isPending?: boolean;
}

export function RejectDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: RejectDialogProps) {
  const [rejectReason, setRejectReason] = useState("");

  // Reset reason when dialog closes
  useEffect(() => {
    if (!open) {
      setRejectReason("");
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!rejectReason.trim()) {
      return;
    }
    await onConfirm(rejectReason);
    setRejectReason("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setRejectReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>رفض النموذج</DialogTitle>
          <DialogDescription>يرجى إدخال سبب الرفض</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason">سبب الرفض</Label>
            <Textarea
              id="reject-reason"
              placeholder="أدخل سبب الرفض..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={500}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            إلغاء
          </Button>
          <Button onClick={handleConfirm} disabled={!rejectReason.trim() || isPending}>
            {isPending ? "جاري الرفض..." : "تأكيد الرفض"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

