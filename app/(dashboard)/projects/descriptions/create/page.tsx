"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, Column } from "@/components/table/data-table";
import {
  Plus,
  Clock,
  FileCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Data interfaces
export interface DescriptionRow {
  id: number;
  checked: boolean;
  floorNumber: string;
  room: string;
  width: string;
  length: string;
  section: string;
  openingType: string;
  shape: string;
  threshold: string;
  openingDirection: string;
  glassColor: string;
  sillHeight: string;
  notes: string;
}

export default function CreateDescriptionPage() {
  const router = useRouter();
  const [tableRows, setTableRows] = useState<DescriptionRow[]>([]);

  const handleRowChange = (
    id: number,
    field: keyof DescriptionRow,
    value: string | boolean
  ) => {
    setTableRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    handleRowChange(id, "checked", checked);
  };

  const handleAddRow = () => {
    const newRow: DescriptionRow = {
      id: tableRows.length + 1,
      checked: false,
      floorNumber: "",
      room: "",
      width: "",
      length: "",
      section: "",
      openingType: "",
      shape: "",
      threshold: "",
      openingDirection: "",
      glassColor: "",
      sillHeight: "",
      notes: "",
    };
    setTableRows([...tableRows, newRow]);
  };

  const handlePostponeSelected = () => {
    const selectedRows = tableRows.filter((row) => row.checked);
    if (selectedRows.length === 0) {
      alert("يرجى تحديد فقرات للتأجيل");
      return;
    }
    console.log("Postpone selected rows:", selectedRows);
    // TODO: Handle postpone logic
  };

  const handleRequestCheck = () => {
    const selectedRows = tableRows.filter((row) => row.checked);
    if (selectedRows.length === 0) {
      alert("يرجى تحديد فقرات لطلب التشك");
      return;
    }
    console.log("Request check for selected rows:", selectedRows);
    // TODO: Handle check request logic
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableRows.length === 0) {
      alert("يرجى إضافة فقرات على الأقل");
      return;
    }
    console.log("Table Rows:", tableRows);
    // TODO: Handle form submission here
  };

  // Table columns
  const columns: Column<DescriptionRow>[] = [
    {
      key: "checkbox",
      header: "",
      render: (row) => (
        <Checkbox
          checked={row.checked}
          onCheckedChange={(checked) =>
            handleCheckboxChange(row.id, checked as boolean)
          }
        />
      ),
    },
    {
      key: "floorNumber",
      header: "الرقم الطابق",
      render: (row) => (
        <Input
          value={row.floorNumber}
          onChange={(e) =>
            handleRowChange(row.id, "floorNumber", e.target.value)
          }
          className="w-20"
        />
      ),
    },
    {
      key: "room",
      header: "الغرفة",
      render: (row) => (
        <Input
          value={row.room}
          onChange={(e) => handleRowChange(row.id, "room", e.target.value)}
          className="w-48"
        />
      ),
    },
    {
      key: "width",
      header: "العرض",
      render: (row) => (
        <Input
          value={row.width}
          onChange={(e) => handleRowChange(row.id, "width", e.target.value)}
          className="w-24"
        />
      ),
    },
    {
      key: "length",
      header: "الطول",
      render: (row) => (
        <Input
          value={row.length}
          onChange={(e) => handleRowChange(row.id, "length", e.target.value)}
          className="w-24"
        />
      ),
    },
    {
      key: "section",
      header: "المقطع",
      render: (row) => (
        <Input
          value={row.section}
          onChange={(e) => handleRowChange(row.id, "section", e.target.value)}
          className="w-32"
        />
      ),
    },
    {
      key: "openingType",
      header: "نوع الفتحة",
      render: (row) => (
        <Input
          value={row.openingType}
          onChange={(e) =>
            handleRowChange(row.id, "openingType", e.target.value)
          }
          className="w-24"
        />
      ),
    },
    {
      key: "shape",
      header: "الشكل",
      render: (row) => (
        <Input
          value={row.shape}
          onChange={(e) => handleRowChange(row.id, "shape", e.target.value)}
          className="w-24"
        />
      ),
    },
    {
      key: "threshold",
      header: "العتبة",
      render: (row) => (
        <Input
          value={row.threshold}
          onChange={(e) => handleRowChange(row.id, "threshold", e.target.value)}
          className="w-20"
        />
      ),
    },
    {
      key: "openingDirection",
      header: "اتجاه الفتح",
      render: (row) => (
        <Input
          value={row.openingDirection}
          onChange={(e) =>
            handleRowChange(row.id, "openingDirection", e.target.value)
          }
          className="w-32"
        />
      ),
    },
    {
      key: "glassColor",
      header: "لون الزجاج",
      render: (row) => (
        <Input
          value={row.glassColor}
          onChange={(e) =>
            handleRowChange(row.id, "glassColor", e.target.value)
          }
          className="w-40"
        />
      ),
    },
    {
      key: "sillHeight",
      header: "ارتفاع البرطاشة",
      render: (row) => (
        <Input
          value={row.sillHeight}
          onChange={(e) =>
            handleRowChange(row.id, "sillHeight", e.target.value)
          }
          className="w-24"
        />
      ),
    },
    {
      key: "notes",
      header: "الملاحظات",
      render: (row) => (
        <Input
          value={row.notes}
          onChange={(e) => handleRowChange(row.id, "notes", e.target.value)}
          className="w-40"
        />
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-5">
      {/* Toolbar */}
      <div className="rounded-lg p-4 border">
        <div className="flex gap-3 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRow}
          >
            <Plus className="size-4 ml-2" />
            إضافة أسطر
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePostponeSelected}
            disabled={!tableRows.some((row) => row.checked)}
          >
            <Clock className="size-4 ml-2" />
            تأجيل المحدد
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleRequestCheck}
            disabled={!tableRows.some((row) => row.checked)}
          >
            <FileCheck className="size-4 ml-2" />
            طلب التشك
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg p-6 border">
        <DataTable
          data={tableRows}
          columns={columns}
          emptyMessage="لا توجد بيانات للعرض"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-start pt-4 gap-2">
        <Button
          type="submit"
          className="bg-[#0A3158] text-white hover:bg-[#0A3158]/90 px-8"
        >
          حفظ
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="px-8"
        >
          الغاء
        </Button>
      </div>
    </form>
  );
}
