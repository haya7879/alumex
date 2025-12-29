"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, Column } from "@/components/table/data-table";
import {
  Calendar,
  RefreshCw,
  Plus,
  Trash2,
  Download,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Data interfaces
export interface DescriptionFormData {
  descriptionDate: string;
  approvalDate: string;
  deliveryDate: string;
  deferred: "yes" | "no";
  deferredApprovalDate: string;
  summary: string;
  serialNumber: string;
  projectName: string;
  phone: string;
  totalArea: string;
  area16B: string;
  area4500: string;
  areaCW: string;
  aluminumColor: string;
  glassColor: string;
}

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
  const [formData, setFormData] = useState<DescriptionFormData>({
    descriptionDate: "12/6/2025",
    approvalDate: "12/6/2025",
    deliveryDate: "12/6/2025",
    deferred: "yes",
    deferredApprovalDate: "12/6/2025",
    summary: "",
    serialNumber: "K2561865",
    projectName: "سعدون القيسي - منزل لؤي - العامرية",
    phone: "07705306351",
    totalArea: "77.726133",
    area16B: "36.481062",
    area4500: "41.245071",
    areaCW: "0",
    aluminumColor: "براون ميتالك 7101",
    glassColor: "",
  });

  const [tableRows, setTableRows] = useState<DescriptionRow[]>([
    {
      id: 1,
      checked: true,
      floorNumber: "GF",
      room: "صالة على منور وسطي",
      width: "262.15",
      length: "262.15",
      section: "ALU 16 PRO",
      openingType: "شباك",
      shape: "",
      threshold: "Yes",
      openingDirection: "للداخل شمال",
      glassColor: "سادة ستيوارت + سادة سيكيوريت",
      sillHeight: "15",
      notes: "",
    },
    {
      id: 2,
      checked: false,
      floorNumber: "GF",
      room: "صالة على منور وسطي",
      width: "262.15",
      length: "262.15",
      section: "ALU 16 PRO",
      openingType: "شباك",
      shape: "",
      threshold: "Yes",
      openingDirection: "للداخل شمال",
      glassColor: "سادة ستيوارت + سادة سيكيوريت",
      sillHeight: "15",
      notes: "",
    },
    {
      id: 3,
      checked: false,
      floorNumber: "GF",
      room: "صالة على منور وسطي",
      width: "262.15",
      length: "262.15",
      section: "ALU 16 PRO",
      openingType: "شباك",
      shape: "",
      threshold: "Yes",
      openingDirection: "للداخل يمين",
      glassColor: "سادة ستيوارت + سادة سيكيوريت",
      sillHeight: "15",
      notes: "",
    },
    {
      id: 4,
      checked: true,
      floorNumber: "GF",
      room: "صالة على منور وسطي",
      width: "262.15",
      length: "262.15",
      section: "ALU 16 PRO",
      openingType: "شباك",
      shape: "",
      threshold: "Yes",
      openingDirection: "للداخل شمال",
      glassColor: "سادة ستيوارت + سادة سيكيوريت",
      sillHeight: "15",
      notes: "",
    },
    {
      id: 5,
      checked: true,
      floorNumber: "GF",
      room: "صالة على منور وسطي",
      width: "262.15",
      length: "262.15",
      section: "ALU 16 PRO",
      openingType: "شباك",
      shape: "",
      threshold: "Yes",
      openingDirection: "للداخل يمين",
      glassColor: "سادة ستيوارت + سادة سيكيوريت",
      sillHeight: "15",
      notes: "",
    },
  ]);

  const handleInputChange = (
    field: keyof DescriptionFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleDeleteSelected = () => {
    setTableRows((prev) => prev.filter((row) => !row.checked));
  };

  const handlePostponeSelected = () => {
    console.log("Postpone selected rows");
    // Handle postpone logic
  };

  const handleExportPDF = () => {
    console.log("Export selected rows to PDF");
    // Handle PDF export logic
  };

  const handleCreateProductionRequest = () => {
    console.log("Create production request");
    // Handle production request logic
  };

  const handleRequestCheck = () => {
    console.log("Request check");
    // Handle check request logic
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Table Rows:", tableRows);
    // Handle form submission here
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
      {/* Contract Information Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="descriptionDate">تاريخ الوصف</Label>
          <Input
            id="descriptionDate"
            type="text"
            placeholder="----/--/--"
            icon={Calendar}
            value={formData.descriptionDate}
            onChange={(e) =>
              handleInputChange("descriptionDate", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="approvalDate">تاريخ الاعتماد</Label>
          <Input
            id="approvalDate"
            type="text"
            placeholder="----/--/--"
            icon={Calendar}
            value={formData.approvalDate}
            onChange={(e) => handleInputChange("approvalDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryDate">تاريخ التسليم للزبون</Label>
          <Input
            id="deliveryDate"
            type="text"
            placeholder="----/--/--"
            icon={Calendar}
            value={formData.deliveryDate}
            onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deferred">مؤجلات</Label>
          <Select
            value={formData.deferred}
            onValueChange={(value) =>
              handleInputChange("deferred", value as "yes" | "no")
            }
          >
            <SelectTrigger id="deferred">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">يوجد</SelectItem>
              <SelectItem value="no">لا يوجد</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.deferred === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="deferredApprovalDate">تاريخ اعتماد المؤجلات</Label>
            <Input
              id="deferredApprovalDate"
              type="text"
              placeholder="----/--/--"
              icon={Calendar}
              value={formData.deferredApprovalDate}
              onChange={(e) =>
                handleInputChange("deferredApprovalDate", e.target.value)
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="serialNumber">الرقم التسلسلي</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => handleInputChange("serialNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2 col-span-3">
          <Label htmlFor="projectName">اسم المشروع</Label>
          <Input
            id="projectName"
            value={formData.projectName}
            onChange={(e) => handleInputChange("projectName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </div>

        <div className="space-y-2 col-span-3">
          <Label htmlFor="summary">ملخص</Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => handleInputChange("summary", e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">المواصفات الفنية للمشروع</h2>
          <Button variant="ghost" size="icon">
            <RefreshCw className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="totalArea">المساحة الكلية</Label>
            <Input
              id="totalArea"
              value={formData.totalArea}
              onChange={(e) => handleInputChange("totalArea", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area16B">مساحة 16 باء</Label>
            <Input
              id="area16B"
              value={formData.area16B}
              onChange={(e) => handleInputChange("area16B", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area4500">مساحة 4500</Label>
            <Input
              id="area4500"
              value={formData.area4500}
              onChange={(e) => handleInputChange("area4500", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaCW">مساحة C.W</Label>
            <Input
              id="areaCW"
              value={formData.areaCW}
              onChange={(e) => handleInputChange("areaCW", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aluminumColor">لون الألمينوم</Label>
            <Input
              id="aluminumColor"
              value={formData.aluminumColor}
              onChange={(e) =>
                handleInputChange("aluminumColor", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="glassColor">لون الزجاج</Label>
            <Input
              id="glassColor"
              value={formData.glassColor}
              onChange={(e) => handleInputChange("glassColor", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleRequestCheck}
          >
            طلب تشك
          </Button>
        </div> */}

      {/* Toolbar */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePostponeSelected}
          >
            <FileText className="size-4 ml-2" />
            تأجيل المحدد
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="size-4 ml-2" />
            حذف الفقرة
          </Button>
          <Button type="button" variant="outline" onClick={handleExportPDF}>
            <Download className="size-4 ml-2" />
            تصدير PDF المحدد
          </Button>
          <Button type="button" variant="outline" onClick={handleAddRow}>
            <Plus className="size-4 ml-2" />
            أضف أسطر
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCreateProductionRequest}
          >
            <Plus className="size-4 ml-2" />
            إنشاء طلب انتاج
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg p-6 border">
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
