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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { useCreateShowroomVisit } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useDateConverter } from "@/hooks/use-date-converter";
import { useDateSync } from "@/hooks/use-date-sync";

export interface DailyVisitFormData {
  customerName: string;
  phone: string;
  location: string;
  visitDate: string;
  status: string;
  notes: string;
}

export default function CreateDailyVisitPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createShowroomVisitMutation = useCreateShowroomVisit();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { formatDateToDisplay, convertDateToAPIFormat } = useDateConverter();
  
  const [formData, setFormData] = useState<DailyVisitFormData>({
    customerName: "",
    phone: "",
    location: "",
    visitDate: "",
    status: "",
    notes: "",
  });

  // Sync selectedDate with formData.visitDate using useDateSync hook
  const { selectedDate, setSelectedDate } = useDateSync(formData.visitDate);

  const handleInputChange = (
    field: keyof DailyVisitFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = formatDateToDisplay(date);
      setFormData((prev) => ({ ...prev, visitDate: formattedDate }));
      setCalendarOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customerName.trim()) {
      toast.error("يرجى إدخال اسم الزبون");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("يرجى إدخال الموقع");
      return;
    }
    if (!formData.visitDate.trim()) {
      toast.error("يرجى إدخال تاريخ الزيارة");
      return;
    }
    if (!formData.status) {
      toast.error("يرجى اختيار الحالة");
      return;
    }

    try {
      // Prepare request body
      const requestBody: {
        customer_name: string;
        location: string;
        phone: string;
        visit_date: string;
        status: string;
        notes?: string;
      } = {
        customer_name: formData.customerName.trim(),
        location: formData.location.trim(),
        phone: formData.phone.trim(),
        visit_date: convertDateToAPIFormat(formData.visitDate),
        status: formData.status,
      };

      // Add notes if provided
      if (formData.notes.trim()) {
        requestBody.notes = formData.notes.trim();
      }

      await createShowroomVisitMutation.mutateAsync(requestBody);

      // Invalidate showroom visits query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["showroom-visits"] });

      toast.success("تم إنشاء الزيارة بنجاح");
      
      // Redirect to showroom visits list
      router.push("/sales/daily-visits");
    } catch (error) {
      console.error("Failed to create showroom visit:", error);
      toast.error("فشل إنشاء الزيارة. يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-5">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
          <Label htmlFor="visitDate">تاريخ الزيارة</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id="visitDate"
                  type="text"
                  placeholder="----/--/--"
                  value={formData.visitDate}
                  onChange={(e) => handleInputChange("visitDate", e.target.value)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">الحالة</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quotation_received">استلم عرض سعر</SelectItem>
              <SelectItem value="initial_measurements_requested">تم طلب القياسات</SelectItem>
              <SelectItem value="sections_explained">تم شرح المقاطع</SelectItem>
              <SelectItem value="contract_signed">تم توقيع العقد</SelectItem>
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

      {/* Submit Button */}
      <div className="flex justify-start pt-4 gap-2">
        <Button
          type="submit"
          className="bg-[#3675AF] text-white hover:bg-[#3675AF]/90 px-8"
          disabled={createShowroomVisitMutation.isPending}
        >
          {createShowroomVisitMutation.isPending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
