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

interface Section {
  id: number;
  name: string;
}

interface QuotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionsData?: Section[];
  onConfirm: (sectionPrices: Record<number, number>) => void;
  isPending?: boolean;
}

export function QuotationDialog({
  open,
  onOpenChange,
  sectionsData,
  onConfirm,
  isPending = false,
}: QuotationDialogProps) {
  const [sectionPrices, setSectionPrices] = useState<Record<number, number>>({});

  // Reset prices when dialog closes
  useEffect(() => {
    if (!open) {
      setSectionPrices({});
    } else {
      // Initialize section prices with empty values when dialog opens
      const initialPrices: Record<number, number> = {};
      if (sectionsData) {
        sectionsData.forEach((section) => {
          initialPrices[section.id] = 0;
        });
      }
      setSectionPrices(initialPrices);
    }
  }, [open, sectionsData]);

  const handleConfirm = () => {
    onConfirm(sectionPrices);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSectionPrices({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء عرض سعر</DialogTitle>
          <DialogDescription>
            يرجى إدخال سعر المتر لكل قطاع
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {sectionsData && sectionsData.length > 0 ? (
            <div className="space-y-3">
              {sectionsData.map((section) => (
                <div key={section.id} className="space-y-2">
                  <Label htmlFor={`section-${section.id}`}>
                    {section.name}
                  </Label>
                  <Input
                    id={`section-${section.id}`}
                    type="number"
                    placeholder="أدخل سعر المتر"
                    value={sectionPrices[section.id] || ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setSectionPrices((prev) => ({
                        ...prev,
                        [section.id]: value,
                      }));
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              جاري تحميل القطاعات...
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            إلغاء
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || !sectionsData || sectionsData.length === 0}
          >
            {isPending ? "جاري الحفظ..." : "إنشاء عرض السعر"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

