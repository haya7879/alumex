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

export interface CompanyFormData {
  companyName: string;
  location: string;
  phone: string;
  email?: string;
  date: string;
  status: string;
  notes?: string;
}

export default function CreateCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    location: "",
    phone: "",
    email: "",
    date: "",
    status: "",
    notes: "",
  });

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Handle form submission here
    // After successful submission, you might want to redirect
    // router.push("/sales/companies");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-5">
      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="companyName">اسم الشركة</Label>
          <Input
            id="companyName"
            placeholder="ادخل اسم الشركة هنا"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">الموقع</Label>
          <Input
            id="location"
            placeholder="ادخل الموقع هنا"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
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
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="ادخل البريد الإلكتروني هنا"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">التاريخ</Label>
          <Input
            id="date"
            type="text"
            placeholder="----/--/--"
            icon={Calendar}
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">الحالة</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="اختر حالة الشركة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

      {/* Submit Buttons */}
      <div className="flex justify-start pt-4 gap-2">
        <Button
          type="submit"
          className="bg-[#3675AF] text-white hover:bg-[#3675AF]/90 px-8"
        >
          حفظ
        </Button>
      </div>
    </form>
  );
}
