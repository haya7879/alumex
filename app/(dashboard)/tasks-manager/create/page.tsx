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

export interface TaskFormData {
  taskName: string;
  projectName: string;
  endDate: string;
  priority: string;
  status: string;
  description?: string;
}

export default function CreateTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TaskFormData>({
    taskName: "",
    projectName: "",
    endDate: "",
    priority: "",
    status: "",
    description: "",
  });

  const handleInputChange = (
    field: keyof TaskFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Handle form submission here
    // After successful submission, you might want to redirect
    // router.push("/tasks-manager/all-tasks");
  };

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-6">إضافة مهمة جديدة</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Three Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="taskName">اسم المهمة</Label>
            <Input
              id="taskName"
              placeholder="ادخل اسم المهمة هنا"
              value={formData.taskName}
              onChange={(e) =>
                handleInputChange("taskName", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName">اسم المشروع</Label>
            <Select
              value={formData.projectName}
              onValueChange={(value) => handleInputChange("projectName", value)}
            >
              <SelectTrigger id="projectName">
                <SelectValue placeholder="اختر المشروع من القائمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project1">شركة اليد للبناء</SelectItem>
                <SelectItem value="project2">مشروع 2</SelectItem>
                <SelectItem value="project3">مشروع 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">تاريخ الانتهاء</Label>
            <Input
              id="endDate"
              type="text"
              placeholder="----/--/--"
              icon={Calendar}
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">الأولوية</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="اختر الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="LOW">LOW</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">الحالة</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="اختر حالة المهمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">لم تبدأ بعد</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="space-y-2">
          <Label htmlFor="description">الوصف</Label>
          <Textarea
            id="description"
            placeholder="ادخل وصف المهمة هنا"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        {/* Submit Buttons */}
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
