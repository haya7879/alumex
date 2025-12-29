"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, Column } from "@/components/table";
import { ChevronLeft, Plus, Trash2, Download, ChevronRight } from "lucide-react";

export interface MeasurementRow {
  id: number;
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

interface StepThreeProps {
  measurementRows: MeasurementRow[];
  onRowChange: (id: number, field: keyof MeasurementRow, value: string | boolean) => void;
  onCheckboxChange: (id: number, checked: boolean) => void;
  onAddRow: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export default function StepThree({
  measurementRows,
  onRowChange,
  onCheckboxChange,
  onAddRow,
  onPrev,
  onSubmit,
}: StepThreeProps) {
  const calculateTotal = () => {
    const checkedRows = measurementRows.filter((row) => row.checked);
    const totalCount = checkedRows.reduce((sum, row) => sum + parseFloat(row.count || "0"), 0);
    const totalAreaCm2 = checkedRows.reduce(
      (sum, row) => sum + parseFloat(row.areaCm2?.replace(/,/g, "") || "0"),
      0
    );
    const totalAreaM2 = checkedRows.reduce(
      (sum, row) => sum + parseFloat(row.areaM2 || "0"),
      0
    );
    const totalPrice = checkedRows.reduce(
      (sum, row) => sum + parseFloat(row.total?.replace(/[^0-9.]/g, "") || "0"),
      0
    );

    return {
      count: totalCount,
      areaCm2: totalAreaCm2.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      areaM2: totalAreaM2.toFixed(3),
      total: totalPrice.toLocaleString("en-US") + " د.ع",
    };
  };

  const totals = calculateTotal();

  const measurementColumns: Column<MeasurementRow>[] = [
    {
      key: "checkbox",
      header: "",
      className: "w-12",
      render: (row) => (
        <Checkbox
          checked={row.checked}
          onCheckedChange={(checked) => onCheckboxChange(row.id, checked as boolean)}
        />
      ),
    },
    {
      key: "id",
      header: "الرقم",
    },
    {
      key: "floor",
      header: "الطابق",
      render: (row) => (
        <Input
          value={row.floor}
          onChange={(e) => onRowChange(row.id, "floor", e.target.value)}
          className="w-20 h-8 py-1"
        />
      ),
    },
    {
      key: "location",
      header: "الموقع",
      render: (row) => (
        <Input
          value={row.location}
          onChange={(e) => onRowChange(row.id, "location", e.target.value)}
          className="w-48 h-8 py-1 text-xs!"
        />
      ),
    },
    {
      key: "width",
      header: "العرض",
      render: (row) => (
        <Input
          value={row.width}
          onChange={(e) => onRowChange(row.id, "width", e.target.value)}
          className="w-24 h-8 py-1 text-xs!"
        />
      ),
    },
    {
      key: "length",
      header: "الطول",
      render: (row) => (
        <Input
          value={row.length}
          onChange={(e) => onRowChange(row.id, "length", e.target.value)}
          className="w-24 h-8 py-1 text-xs!"
        />
      ),
    },
    {
      key: "count",
      header: "العدد",
      render: (row) => (
        <Input
          value={row.count}
          onChange={(e) => onRowChange(row.id, "count", e.target.value)}
          className="w-16 h-8 py-1 text-xs!"
        />
      ),
    },
    {
      key: "areaCm2",
      header: "المساحة سم2",
      render: (row) => (
        <Input
          value={row.areaCm2}
          onChange={(e) => onRowChange(row.id, "areaCm2", e.target.value)}
          className="w-28 h-8 py-1 text-xs!"
        />
      ),
    },
    {
      key: "areaM2",
      header: "المساحة م2",
      render: (row) => (
        <Input
          value={row.areaM2}
          onChange={(e) => onRowChange(row.id, "areaM2", e.target.value)}
          className="w-24 h-8 py-1 text-xs!"
        />
      ),
    },
    {
      key: "pricePerMeter",
      header: "سعر المتر",
      render: (row) => (
        <Input
          value={row.pricePerMeter}
          onChange={(e) => onRowChange(row.id, "pricePerMeter", e.target.value)}
          className="w-32 h-8 py-1 text-xs!"
        />
      ),
    },
    {
      key: "total",
      header: "الأجمالي",
      render: (row) => (
        <Input
          value={row.total}
          onChange={(e) => onRowChange(row.id, "total", e.target.value)}
          className="w-32 h-8 py-1 text-xs!"
        />
      ),
    },
  ];

  return (
    <div className="mt-6">
      {/* Section Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <Button className="bg-gray-100 text-gray-600 hover:text-white dark:text-gray-100 dark:bg-gray-800 text-xs" size="sm">
          ألمنيوم مقطع السحاب
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          ألمنيوم مقطع السحاب
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          ألمنيوم مقطع السحاب
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Trash2 className="size-4 ml-2" /> حذف 
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-4 ml-2" /> تصدير PDF 
          </Button>
        </div>
        <Button onClick={onAddRow}>
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <DataTable
          data={measurementRows}
          columns={measurementColumns}
          emptyMessage="لا توجد بيانات"
        />
        {/* Total Row */}
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
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button onClick={onPrev} variant="outline" className="min-w-[100px]">
          <ChevronRight className="size-4 ml-2" /> السابق
        </Button>
        <Button onClick={onSubmit} className="min-w-[100px]">
          حفظ
        </Button>
      </div>
    </div>
  );
}

