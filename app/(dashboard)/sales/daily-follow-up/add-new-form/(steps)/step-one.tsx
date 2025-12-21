"use client";

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
import { Calendar, ChevronRight } from "lucide-react";

export interface BasicInfoFormData {
  approvedCompany: string;
  followUpEngineer: string;
  delegate: string;
  projectName: string;
  phoneNumber: string;
  phoneNumber2: string;
  projectCategory: string;
  projectStage: string;
  date: string;
  address: string;
}

interface StepOneProps {
  formData: BasicInfoFormData;
  onInputChange: (field: keyof BasicInfoFormData, value: string) => void;
  onNext: () => void;
}

export default function StepOne({ formData, onInputChange, onNext }: StepOneProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
      <h2 className="text-2xl font-semibold mb-6">المعلومات الاساسية</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="approvedCompany">الشركة المتعتمدة</Label>
          <Select
            value={formData.approvedCompany}
            onValueChange={(value) => onInputChange("approvedCompany", value)}
          >
            <SelectTrigger id="approvedCompany">
              <SelectValue placeholder="أختر الشركة المعتمدة لهذا المشروع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company1">شركة 1</SelectItem>
              <SelectItem value="company2">شركة 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="followUpEngineer">المهندس المتابع</Label>
          <Input
            id="followUpEngineer"
            placeholder="مثال: م. فادي خرشوم"
            value={formData.followUpEngineer}
            onChange={(e) => onInputChange("followUpEngineer", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delegate">المندوب</Label>
          <Select
            value={formData.delegate}
            onValueChange={(value) => onInputChange("delegate", value)}
          >
            <SelectTrigger id="delegate">
              <SelectValue placeholder="أختر المندوب من القائمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delegate1">مندوب 1</SelectItem>
              <SelectItem value="delegate2">مندوب 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectName">اسم المشروع</Label>
          <Input
            id="projectName"
            placeholder="الشركة المعتمدة _ _ المهندس المتابع"
            value={formData.projectName}
            onChange={(e) => onInputChange("projectName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">رقم الهاتف</Label>
          <Input
            id="phoneNumber"
            placeholder="مثال : 07 897897894"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber2">رقم الهاتف 2</Label>
          <Input
            id="phoneNumber2"
            placeholder="مثال : 07 897897894"
            value={formData.phoneNumber2}
            onChange={(e) => onInputChange("phoneNumber2", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectCategory">صنف المشروع</Label>
          <Select
            value={formData.projectCategory}
            onValueChange={(value) => onInputChange("projectCategory", value)}
          >
            <SelectTrigger id="projectCategory">
              <SelectValue placeholder="أختر الصنف من القائمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category1">صنف 1</SelectItem>
              <SelectItem value="category2">صنف 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectStage">مرحلة المشروع</Label>
          <Select
            value={formData.projectStage}
            onValueChange={(value) => onInputChange("projectStage", value)}
          >
            <SelectTrigger id="projectStage">
              <SelectValue placeholder="أختر مرحلة المشروع من القائمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stage1">مرحلة 1</SelectItem>
              <SelectItem value="stage2">مرحلة 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">التاريخ</Label>
          <div className="relative">
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => onInputChange("date", e.target.value)}
              className="pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-red-500 mt-1">
            انتبه لا يمكن تعديل التاريخ بعد انشاؤه الا بموافقة المدير
          </p>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="address">العنوان</Label>
          <Textarea
            id="address"
            placeholder="أدخل العنوان التفصيلي:"
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={onNext} className="bg-primary hover:bg-primary/80">
          التالي <ChevronRight className="size-4 mr-2" />
        </Button>
      </div>
    </div>
  );
}

