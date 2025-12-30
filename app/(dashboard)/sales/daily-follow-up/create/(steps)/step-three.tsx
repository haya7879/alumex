"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, Column } from "@/components/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

export interface MeasurementRow {
  id: number;
  number: number;
  floor: string;
  location: string;
  width: string;
  length: string;
  count: string;
  areaCm2: string;
  areaM2: string;
  pricePerMeter: string;
  total: string;
  checked: boolean;
}

export interface Section {
  id: number;
  name: string;
  measurements: MeasurementRow[];
}

interface StepThreeProps {
  formId: number;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onSave: () => Promise<void>;
  onPrev: () => void;
}

// Available sections - in real app, fetch from API
const availableSections = [
  "ألمنيوم مقطع السحاب (ALUMAX 16 SLIDING SYSTEM)",
  "ألمنيوم مقطع السحاب (ALUMAX 20 SLIDING SYSTEM)",
  "ألمنيوم مقطع السحاب (ALUMAX 25 SLIDING SYSTEM)",
  "ألمنيوم مقطع السحاب (ALUMAX 30 SLIDING SYSTEM)",
  "ألمنيوم مقطع السحاب (ALUMAX 35 SLIDING SYSTEM)",
  "ألمنيوم مقطع السحاب (ALUMAX 40 SLIDING SYSTEM)",
  "ألمنيوم مقطع السحاب (ALUMAX 45 SLIDING SYSTEM)",
  "ألمنيوم مقطع السحاب (ALUMAX 50 SLIDING SYSTEM)",
];

const floors = [
  "GF",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "F13",
  "F14",
  "F15",
  "F16",
  "F17",
];

export default function StepThree({
  formId,
  sections,
  onSectionsChange,
  onSave,
  onPrev,
}: StepThreeProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    sections.length > 0 ? sections[0].id : null
  );
  const [showSectionSelector, setShowSectionSelector] = useState(
    sections.length === 0
  );
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<MeasurementRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [addRowsDialog, setAddRowsDialog] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("GF");
  const [rowsToAdd, setRowsToAdd] = useState(1);

  const calculateArea = (width: string, length: string) => {
    const w = parseFloat(width) || 0;
    const l = parseFloat(length) || 0;
    const areaCm2 = w * l;
    const areaM2 = areaCm2 / 10000;
    return {
      areaCm2: areaCm2.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
      areaM2: areaM2.toFixed(3),
    };
  };

  const calculateTotal = (
    areaM2: string,
    pricePerMeter: string,
    count: string
  ) => {
    const area = parseFloat(areaM2) || 0;
    const price = parseFloat(pricePerMeter.replace(/[^0-9.]/g, "")) || 260000;
    const qty = parseFloat(count) || 1;
    const total = area * price * qty;
    return total.toLocaleString("en-US") + " د.ع";
  };

  const handleSectionSelection = () => {
    if (selectedSections.length === 0) {
      toast.error("يرجى اختيار مقطع واحد على الأقل");
      return;
    }

    const newSections: Section[] = selectedSections.map((name, index) => ({
      id: index + 1,
      name,
      measurements: [],
    }));

    onSectionsChange(newSections);
    setSelectedSectionId(newSections[0].id);
    setShowSectionSelector(false);
    toast.success("تم اختيار المقاطع بنجاح");
  };

  const getCurrentSection = () => {
    return sections.find((s) => s.id === selectedSectionId);
  };

  const handleRowChange = (
    sectionId: number,
    rowId: number,
    field: keyof MeasurementRow,
    value: string | boolean
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedMeasurements = section.measurements.map((row) => {
          if (row.id === rowId) {
            const updatedRow = { ...row, [field]: value };

            // Auto-calculate areas if width or length changed
            if (field === "width" || field === "length") {
              const areas = calculateArea(
                field === "width" ? (value as string) : updatedRow.width,
                field === "length" ? (value as string) : updatedRow.length
              );
              updatedRow.areaCm2 = areas.areaCm2;
              updatedRow.areaM2 = areas.areaM2;

              // Recalculate total
              updatedRow.total = calculateTotal(
                updatedRow.areaM2,
                updatedRow.pricePerMeter,
                updatedRow.count
              );
            }

            // Auto-calculate total if price or count changed
            if (field === "pricePerMeter" || field === "count") {
              updatedRow.total = calculateTotal(
                updatedRow.areaM2,
                field === "pricePerMeter"
                  ? (value as string)
                  : updatedRow.pricePerMeter,
                field === "count" ? (value as string) : updatedRow.count
              );
            }

            return updatedRow;
          }
          return row;
        });
        return { ...section, measurements: updatedMeasurements };
      }
      return section;
    });

    onSectionsChange(updatedSections);
  };

  const handleAddRows = () => {
    if (!selectedSectionId) return;

    const currentSection = getCurrentSection();
    if (!currentSection) return;

    const maxId =
      currentSection.measurements.length > 0
        ? Math.max(...currentSection.measurements.map((r) => r.id))
        : 0;

    const newRows: MeasurementRow[] = Array.from(
      { length: rowsToAdd },
      (_, i) => {
        const id = maxId + i + 1;
        const number = currentSection.measurements.length + i + 1;
        return {
          id,
          number,
          floor: selectedFloor,
          location: "",
          width: "",
          length: "",
          count: "1",
          areaCm2: "",
          areaM2: "",
          pricePerMeter: "260,000 د.ع",
          total: "",
          checked: false,
        };
      }
    );

    const updatedSections = sections.map((section) => {
      if (section.id === selectedSectionId) {
        return {
          ...section,
          measurements: [...section.measurements, ...newRows],
        };
      }
      return section;
    });

    onSectionsChange(updatedSections);
    setAddRowsDialog(false);
    setRowsToAdd(1);
    toast.success(`تم إضافة ${rowsToAdd} سطر`);
  };

  const handleDeleteSelected = () => {
    if (!selectedSectionId) return;

    const currentSection = getCurrentSection();
    if (!currentSection) return;

    const selected = currentSection.measurements.filter((r) => r.checked);
    if (selected.length === 0) {
      toast.error("يرجى تحديد سطر للحذف");
      return;
    }

    setRowsToDelete(selected);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedSectionId) return;

    const updatedSections = sections.map((section) => {
      if (section.id === selectedSectionId) {
        return {
          ...section,
          measurements: section.measurements.filter((r) => !r.checked),
        };
      }
      return section;
    });

    onSectionsChange(updatedSections);
    setShowDeleteDialog(false);
    setRowsToDelete([]);
    toast.success("تم حذف الأسطر المحددة");
  };

  const handleExportPDF = () => {
    if (!selectedSectionId) return;

    const currentSection = getCurrentSection();
    if (!currentSection) return;

    const selected = currentSection.measurements.filter((r) => r.checked);
    if (selected.length === 0) {
      toast.error("يرجى تحديد أسطر للتصدير");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(currentSection.name, 14, 20);

    // Table headers
    const headers = [
      "الرقم",
      "الطابق",
      "الموقع",
      "العرض",
      "الطول",
      "العدد",
      "المساحة سم²",
      "المساحة م²",
      "سعر المتر",
      "الإجمالي",
    ];
    const startY = 40;
    let y = startY;

    doc.setFontSize(10);
    headers.forEach((header, i) => {
      doc.text(header, 14 + i * 18, y);
    });

    y += 10;
    selected.forEach((row) => {
      const data = [
        row.number.toString(),
        row.floor,
        row.location,
        row.width,
        row.length,
        row.count,
        row.areaCm2,
        row.areaM2,
        row.pricePerMeter,
        row.total,
      ];
      data.forEach((cell, i) => {
        doc.text(cell, 14 + i * 18, y);
      });
      y += 10;
    });

    doc.save(`${currentSection.name}_${Date.now()}.pdf`);
    toast.success("تم تصدير PDF بنجاح");
  };

  const calculateSectionTotals = (measurements: MeasurementRow[]) => {
    const totalCount = measurements.reduce(
      (sum, row) => sum + (parseFloat(row.count) || 0),
      0
    );
    const totalAreaCm2 = measurements.reduce(
      (sum, row) => sum + parseFloat(row.areaCm2.replace(/,/g, "") || "0"),
      0
    );
    const totalAreaM2 = measurements.reduce(
      (sum, row) => sum + parseFloat(row.areaM2 || "0"),
      0
    );
    const totalPrice = measurements.reduce(
      (sum, row) => sum + parseFloat(row.total.replace(/[^0-9.]/g, "") || "0"),
      0
    );

    return {
      count: totalCount,
      areaCm2: totalAreaCm2.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
      areaM2: totalAreaM2.toFixed(3),
      total: totalPrice.toLocaleString("en-US") + " د.ع",
    };
  };

  const handleCheckboxChange = (
    sectionId: number,
    rowId: number,
    checked: boolean
  ) => {
    handleRowChange(sectionId, rowId, "checked", checked);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      toast.success("تم حفظ جميع القياسات بنجاح");
      // Return to step one
      window.location.reload();
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ القياسات");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (showSectionSelector) {
    return (
      <div className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">اختر المقاطع المتاحة</h3>
          <div className="grid grid-cols-3 gap-4">
            {availableSections.map((section) => (
              <div key={section} className="flex items-center gap-2">
                <Checkbox
                  id={section}
                  checked={selectedSections.includes(section)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSections([...selectedSections, section]);
                    } else {
                      setSelectedSections(
                        selectedSections.filter((s) => s !== section)
                      );
                    }
                  }}
                />
                <label htmlFor={section} className="text-sm cursor-pointer">
                  {section}
                </label>
              </div>
            ))}
          </div>
          <Button
            onClick={handleSectionSelection}
            className="mt-5 min-w-[100px]"
          >
            تأكيد
          </Button>
        </div>
      </div>
    );
  }

  const currentSection = getCurrentSection();
  if (!currentSection) return null;

  const totals = calculateSectionTotals(currentSection.measurements);

  const measurementColumns: Column<MeasurementRow>[] = [
    {
      key: "checkbox",
      header: "",
      className: "w-12",
      render: (row) => (
        <Checkbox
          checked={row.checked}
          onCheckedChange={(checked) =>
            handleCheckboxChange(selectedSectionId!, row.id, checked as boolean)
          }
        />
      ),
    },
    {
      key: "number",
      header: "الرقم",
      className: "w-16",
      render: (row) => <span>{row.number}</span>,
    },
    {
      key: "floor",
      header: "الطابق",
      className: "w-24",
      render: (row) => (
        <Select
          value={row.floor}
          onValueChange={(value) =>
            handleRowChange(selectedSectionId!, row.id, "floor", value)
          }
        >
          <SelectTrigger className="h-8 w-20">
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
      ),
    },
    {
      key: "location",
      header: "الموقع",
      className: "w-48",
      render: (row) => (
        <Input
          value={row.location}
          onChange={(e) =>
            handleRowChange(
              selectedSectionId!,
              row.id,
              "location",
              e.target.value
            )
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "width",
      header: "العرض",
      className: "w-24",
      render: (row) => (
        <Input
          value={row.width}
          onChange={(e) =>
            handleRowChange(selectedSectionId!, row.id, "width", e.target.value)
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "length",
      header: "الطول",
      className: "w-24",
      render: (row) => (
        <Input
          value={row.length}
          onChange={(e) =>
            handleRowChange(
              selectedSectionId!,
              row.id,
              "length",
              e.target.value
            )
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "count",
      header: "العدد",
      className: "w-16",
      render: (row) => (
        <Input
          value={row.count}
          onChange={(e) =>
            handleRowChange(selectedSectionId!, row.id, "count", e.target.value)
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "areaCm2",
      header: "المساحة سم²",
      className: "w-28",
      render: (row) => (
        <Input value={row.areaCm2} readOnly className="h-8 text-xs" />
      ),
    },
    {
      key: "areaM2",
      header: "المساحة م²",
      className: "w-24",
      render: (row) => (
        <Input value={row.areaM2} readOnly className="h-8 text-xs" />
      ),
    },
    {
      key: "pricePerMeter",
      header: "سعر المتر",
      className: "w-32",
      render: (row) => (
        <Input
          value={row.pricePerMeter}
          onChange={(e) =>
            handleRowChange(
              selectedSectionId!,
              row.id,
              "pricePerMeter",
              e.target.value
            )
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "total",
      header: "الإجمالي",
      className: "w-32",
      render: (row) => (
        <Input value={row.total} readOnly className="h-8 text-xs" />
      ),
    },
  ];

  return (
    <div className="mt-6">
      {/* Section Tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() => setSelectedSectionId(section.id)}
            variant={selectedSectionId === section.id ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {section.name}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setAddRowsDialog(true)}
          size="sm"
        >
          <Plus className="size-4 ml-2" /> إضافة أسطر
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
            <Trash2 className="size-4 ml-2" /> حذف
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="size-4 ml-2" /> تصدير PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <DataTable
          data={currentSection.measurements}
          columns={measurementColumns}
          emptyMessage="لا توجد بيانات"
        />
        {/* Total Row */}
        {currentSection.measurements.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 border-t text-sm">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 font-semibold items-center">
              <div className="col-span-2 text-center">المجموع</div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div>{totals.count}</div>
              <div>{totals.areaCm2}</div>
              <div>{totals.areaM2}</div>
              <div></div>
              <div>{totals.total}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button onClick={onPrev} variant="outline" className="min-w-[100px]">
          <ChevronRight className="size-4 ml-2" /> السابق
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ"
          )}
        </Button>
      </div>

      {/* Add Rows Dialog */}
      <Dialog open={addRowsDialog} onOpenChange={setAddRowsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة أسطر جديدة</DialogTitle>
            <DialogDescription>
              اختر الطابق وعدد الأسطر المراد إضافتها (من 1 إلى 17)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">الطابق</label>
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
              <label className="text-sm font-medium">عدد الأسطر</label>
              <Input
                type="number"
                min="1"
                max="17"
                value={rowsToAdd}
                onChange={(e) =>
                  setRowsToAdd(
                    Math.min(17, Math.max(1, parseInt(e.target.value) || 1))
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRowsDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddRows}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف {rowsToDelete.length} سطر؟ سيتم حذف:
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {rowsToDelete.map((row) => (
              <div key={row.id} className="text-sm p-2 rounded">
                <div>
                  الرقم: {row.number} | الطابق: {row.floor} | الموقع:{" "}
                  {row.location}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
