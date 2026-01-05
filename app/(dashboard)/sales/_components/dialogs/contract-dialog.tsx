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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: string) => void;
  isPending?: boolean;
}

// Helper function to format date from Date object to DD/MM/YYYY
const formatDateToDisplay = (date: Date | undefined): string => {
  if (!date) return "";
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to parse date from DD/MM/YYYY string to Date object
const parseDateFromString = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  // Try DD/MM/YYYY format first
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  // Try YYYY-MM-DD format (from HTML date input)
  const parts2 = dateString.split("-");
  if (parts2.length === 3) {
    const [year, month, day] = parts2;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return undefined;
};

export function ContractDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: ContractDialogProps) {
  const [contractDate, setContractDate] = useState("");
  const [contractCalendarOpen, setContractCalendarOpen] = useState(false);
  const [selectedContractDate, setSelectedContractDate] = useState<Date | undefined>(undefined);

  // Reset date when dialog closes
  useEffect(() => {
    if (!open) {
      setContractDate("");
      setSelectedContractDate(undefined);
      setContractCalendarOpen(false);
    }
  }, [open]);

  // Update selectedContractDate when contractDate changes
  useEffect(() => {
    if (contractDate) {
      const parsedDate = parseDateFromString(contractDate);
      setSelectedContractDate(parsedDate);
    }
  }, [contractDate]);

  // Handle contract date selection from calendar
  const handleContractDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedContractDate(date);
      const formattedDate = formatDateToDisplay(date);
      setContractDate(formattedDate);
      setContractCalendarOpen(false);
    }
  };

  const handleConfirm = () => {
    if (!contractDate.trim()) {
      return;
    }
    onConfirm(contractDate);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setContractDate("");
    setSelectedContractDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تم توقيع العقد</DialogTitle>
          <DialogDescription>يرجى إدخال تاريخ التوقيع</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contract-date">تاريخ التوقيع</Label>
            <Popover open={contractCalendarOpen} onOpenChange={setContractCalendarOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    id="contract-date"
                    type="text"
                    placeholder="----/--/--"
                    value={contractDate}
                    onChange={(e) => {
                      setContractDate(e.target.value);
                      const parsedDate = parseDateFromString(e.target.value);
                      setSelectedContractDate(parsedDate);
                    }}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedContractDate}
                  onSelect={handleContractDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            إلغاء
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!contractDate.trim() || isPending}
          >
            {isPending ? "جاري الحفظ..." : "تأكيد"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

