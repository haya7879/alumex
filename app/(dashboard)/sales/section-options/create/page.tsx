"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export interface SectionFormData {
  sectionName: string;
  status: string;
}

export default function CreateSectionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SectionFormData>({
    sectionName: "",
    status: "",
  });

  const handleInputChange = (field: keyof SectionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Handle form submission here
    // After successful submission, you might want to redirect
    // router.push("/sales/section-options");
  };

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-6">اضافة مقطع جديد</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Name */}
        <div className="space-y-2 w-1/3">
          <Label htmlFor="sectionName">اسم المقطع</Label>
          <Input
            id="sectionName"
            placeholder="ادخل اسم المقطع هنا"
            value={formData.sectionName}
            onChange={(e) => handleInputChange("sectionName", e.target.value)}
          />
        </div>

        {/* Section Status */}
        <div className="space-y-2 w-1/3">
          <Label htmlFor="status">حالة المقطع</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="اختار اذا تريد تفعيل المقطع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">مفعل</SelectItem>
              <SelectItem value="inactive">غير مفعل</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-start pt-4 gap-2">
          <Button
            type="submit"
            className="bg-[#0A3158] text-white hover:bg-[#0A3158]/90 px-8"
          >
            تأكيد
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
    </div>
  );
}

