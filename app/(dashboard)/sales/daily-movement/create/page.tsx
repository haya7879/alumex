"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

export interface DailyMovementFormData {
  customerName: string;
  phone: string;
  location: string;
  status: string;
  postponementDate: string;
  notes: string;
}

export default function CreateDailyMovementPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DailyMovementFormData>({
    customerName: "",
    phone: "",
    location: "",
    status: "",
    postponementDate: "",
    notes: "",
  });

  const handleInputChange = (
    field: keyof DailyMovementFormData,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Clear postponement date if status is not "postponed"
      if (field === "status" && value !== "postponed") {
        updated.postponementDate = "";
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Handle form submission here
    // After successful submission, you might want to redirect
    // router.push("/sales/daily-movement");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-5">
      {/* Two Column Layout */}
      <div className="grid grid-cols-4 gap-3">
        {/* Right Column */}
        <div className="space-y-2">
          <Label htmlFor="customerName">اسم الزبون</Label>
          <Input
            id="customerName"
            placeholder="ادخل اسم المقطع هنا"
            value={formData.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            placeholder="ادخل رقم الهاتف هنا"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">اسم الموقع</Label>
          <Input
            id="location"
            placeholder="ادخل اسم الموقع هنا"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">الحالة</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="حدد هل تم أخذ القياس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">تم أخذ القياس</SelectItem>
              <SelectItem value="not-completed">لم يتم أخذ القياس</SelectItem>
              <SelectItem value="postponed">مؤجل</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.status === "postponed" && (
          <div className="space-y-2">
            <Label htmlFor="postponementDate">تاريخ التأجيل</Label>
            <Input
              id="postponementDate"
              type="text"
              placeholder="----/--/--"
              icon={Calendar}
              value={formData.postponementDate}
              onChange={(e) =>
                handleInputChange("postponementDate", e.target.value)
              }
            />
          </div>
        )}
      </div>

      {/* Notes - Full Width */}
      <div className="space-y-2">
        <Label htmlFor="notes">الملاحظات</Label>
        <Textarea
          id="notes"
          placeholder="ادخل الملاحظات هنا"
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      {/* Submit Button */}
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
