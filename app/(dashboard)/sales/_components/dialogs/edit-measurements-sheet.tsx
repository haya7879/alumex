"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { X, Plus, Trash2 } from "lucide-react";
import { UpdateFormMeasurementsRequest, UpdateMeasurementItem, FormDetailsData } from "@/services/sales/sales-services";
import { useSections } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface EditMeasurementsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: number | null;
  formData: FormDetailsData | null;
  onConfirm: (data: UpdateFormMeasurementsRequest) => Promise<void>;
  isPending: boolean;
  isLoading?: boolean;
}

export function EditMeasurementsSheet({
  open,
  onOpenChange,
  formId,
  formData,
  onConfirm,
  isPending,
  isLoading = false,
}: EditMeasurementsSheetProps) {
  const [measurements, setMeasurements] = useState<UpdateMeasurementItem[]>([]);

  const { data: sectionsData } = useSections();

  // Load existing measurements when formData is available
  useEffect(() => {
    if (formData && formData.measurements && formData.measurements.length > 0 && open) {
      // Convert FormMeasurement[] to UpdateMeasurementItem[]
      const existingMeasurements: UpdateMeasurementItem[] = formData.measurements.map((m) => ({
        id: m.id,
        section_id: m.section_id,
        width: m.width,
        height: m.height,
        qty: m.qty,
        price_per_meter: m.price_per_meter,
      }));
      setMeasurements(existingMeasurements);
    } else if (open && !isLoading) {
      // Initialize with one empty measurement if no existing data
      setMeasurements([
        {
          section_id: 0,
          width: 0,
          height: 0,
          qty: 0,
          price_per_meter: 0,
        },
      ]);
    }
  }, [formData, open, isLoading]);

  // Reset measurements when sheet closes
  useEffect(() => {
    if (!open) {
      setMeasurements([]);
    }
  }, [open]);

  const handleAddMeasurement = () => {
    setMeasurements((prev) => [
      ...prev,
      {
        section_id: 0,
        width: 0,
        height: 0,
        qty: 0,
        price_per_meter: 0,
      },
    ]);
  };

  const handleRemoveMeasurement = (index: number) => {
    setMeasurements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMeasurementChange = (
    index: number,
    field: keyof UpdateMeasurementItem,
    value: number | string
  ) => {
    setMeasurements((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: typeof value === "string" ? parseFloat(value) || 0 : value,
          };
        }
        return item;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate measurements
    const validMeasurements = measurements.filter(
      (m) =>
        m.section_id > 0 &&
        m.width > 0 &&
        m.height > 0 &&
        m.qty > 0 &&
        m.price_per_meter > 0
    );

    if (validMeasurements.length === 0) {
      toast.error("يرجى إدخال قياس واحد على الأقل مع جميع البيانات المطلوبة");
      return;
    }

    try {
      await onConfirm({
        measurements: validMeasurements,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "حدث خطأ أثناء التعديل";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>تعديل القياسات</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <X className="size-4" />
                </Button>
              </SheetClose>
            </div>
            <SheetDescription>تعديل قياسات النموذج</SheetDescription>
          </SheetHeader>
          <div className="text-center py-12 text-muted-foreground">
            جاري التحميل...
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>تعديل القياسات</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="size-4" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription>تعديل قياسات النموذج</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-4">
            {measurements.map((measurement, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">قياس #{index + 1}</h4>
                  {measurements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMeasurement(index)}
                      className="h-6 w-6 text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* القطاع */}
                  <div className="space-y-2">
                    <Label htmlFor={`section-${index}`}>القطاع</Label>
                    <Select
                      value={measurement.section_id > 0 ? measurement.section_id.toString() : ""}
                      onValueChange={(value) =>
                        handleMeasurementChange(index, "section_id", parseInt(value))
                      }
                    >
                      <SelectTrigger id={`section-${index}`}>
                        <SelectValue placeholder="اختر القطاع" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectionsData?.map((section) => (
                          <SelectItem key={section.id} value={section.id.toString()}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* العرض */}
                  <div className="space-y-2">
                    <Label htmlFor={`width-${index}`}>العرض (سم)</Label>
                    <Input
                      id={`width-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      value={measurement.width > 0 ? measurement.width : ""}
                      onChange={(e) =>
                        handleMeasurementChange(index, "width", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* الارتفاع */}
                  <div className="space-y-2">
                    <Label htmlFor={`height-${index}`}>الارتفاع (سم)</Label>
                    <Input
                      id={`height-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      value={measurement.height > 0 ? measurement.height : ""}
                      onChange={(e) =>
                        handleMeasurementChange(index, "height", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* العدد */}
                  <div className="space-y-2">
                    <Label htmlFor={`qty-${index}`}>العدد</Label>
                    <Input
                      id={`qty-${index}`}
                      type="number"
                      min="1"
                      placeholder="0"
                      value={measurement.qty > 0 ? measurement.qty : ""}
                      onChange={(e) =>
                        handleMeasurementChange(index, "qty", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* سعر المتر */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`price-${index}`}>سعر المتر</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      value={measurement.price_per_meter > 0 ? measurement.price_per_meter : ""}
                      onChange={(e) =>
                        handleMeasurementChange(
                          index,
                          "price_per_meter",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Measurement Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddMeasurement}
            className="w-full"
          >
            <Plus className="size-4 ml-2" />
            إضافة قياس جديد
          </Button>

          <SheetFooter className="mt-6 flex-row items-center gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              إلغاء
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
