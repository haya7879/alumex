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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddRowsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (floor: string, rowsCount: number) => void;
  floors: string[];
  title?: string;
  description?: string;
  floorLabel?: string;
  rowsCountLabel?: string;
  minRows?: number;
  maxRows?: number;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function AddRowsDialog({
  open,
  onOpenChange,
  onConfirm,
  floors,
  title = "إضافة أسطر جديدة",
  description = "اختر الطابق وعدد الأسطر المراد إضافتها",
  floorLabel = "الطابق",
  rowsCountLabel = "عدد الأسطر",
  minRows = 1,
  maxRows = 17,
  confirmLabel = "إضافة",
  cancelLabel = "إلغاء",
}: AddRowsDialogProps) {
  const [selectedFloor, setSelectedFloor] = useState(floors[0] || "");
  const [rowsToAdd, setRowsToAdd] = useState(minRows);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedFloor(floors[0] || "");
      setRowsToAdd(minRows);
    }
  }, [open, floors, minRows]);

  const handleConfirm = () => {
    if (!selectedFloor) {
      return;
    }
    onConfirm(selectedFloor, rowsToAdd);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleRowsChange = (value: string) => {
    const numValue = parseInt(value) || minRows;
    const clampedValue = Math.min(maxRows, Math.max(minRows, numValue));
    setRowsToAdd(clampedValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description} (من {minRows} إلى {maxRows})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{floorLabel}</Label>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {floors.map((floor) => (
                  <SelectItem key={floor} value={floor}>
                    {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{rowsCountLabel}</Label>
            <Input
              type="number"
              min={minRows}
              max={maxRows}
              value={rowsToAdd}
              onChange={(e) => handleRowsChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedFloor}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

