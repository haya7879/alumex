"use client";

import { useState, useEffect } from "react";
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
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { useCreateDailyMovement } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface DailyMovementFormData {
  customerName: string;
  phone: string;
  location: string;
  movementDate: string;
  status: string;
  postponementDate: string;
  notes: string;
}

export default function CreateDailyMovementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createDailyMovementMutation = useCreateDailyMovement();
  const [movementCalendarOpen, setMovementCalendarOpen] = useState(false);
  const [postponementCalendarOpen, setPostponementCalendarOpen] = useState(false);
  const [selectedMovementDate, setSelectedMovementDate] = useState<Date | undefined>(undefined);
  const [selectedPostponementDate, setSelectedPostponementDate] = useState<Date | undefined>(undefined);
  
  const [formData, setFormData] = useState<DailyMovementFormData>({
    customerName: "",
    phone: "",
    location: "",
    movementDate: "",
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
        setSelectedPostponementDate(undefined);
      }
      // If movementDate is being changed, update selectedMovementDate
      if (field === "movementDate") {
        const parsedDate = parseDateFromString(value);
        setSelectedMovementDate(parsedDate);
      }
      // If postponementDate is being changed, update selectedPostponementDate
      if (field === "postponementDate") {
        const parsedDate = parseDateFromString(value);
        setSelectedPostponementDate(parsedDate);
      }
      return updated;
    });
  };

  // Handle movement date selection from calendar
  const handleMovementDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedMovementDate(date);
      const formattedDate = formatDateToDisplay(date);
      setFormData((prev) => ({ ...prev, movementDate: formattedDate }));
      setMovementCalendarOpen(false);
    }
  };

  // Handle postponement date selection from calendar
  const handlePostponementDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedPostponementDate(date);
      const formattedDate = formatDateToDisplay(date);
      setFormData((prev) => ({ ...prev, postponementDate: formattedDate }));
      setPostponementCalendarOpen(false);
    }
  };

  // Helper function to format date from Date object to DD/MM/YYYY
  const formatDateToDisplay = (date: Date | undefined): string => {
    if (!date) return "";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to parse date from DD/MM/YYYY string to Date object
  const parseDateFromString = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    // Try DD/MM/YYYY format first
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    // Try YYYY-MM-DD format (from HTML date input)
    const parts2 = dateString.split("-");
    if (parts2.length === 3) {
      const [year, month, day] = parts2;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return undefined;
  };

  // Update selectedMovementDate when formData.movementDate changes
  useEffect(() => {
    if (formData.movementDate) {
      const parsedDate = parseDateFromString(formData.movementDate);
      setSelectedMovementDate(parsedDate);
    }
  }, [formData.movementDate]);

  // Update selectedPostponementDate when formData.postponementDate changes
  useEffect(() => {
    if (formData.postponementDate) {
      const parsedDate = parseDateFromString(formData.postponementDate);
      setSelectedPostponementDate(parsedDate);
    }
  }, [formData.postponementDate]);

  // Helper function to convert date from DD/MM/YYYY to YYYY-MM-DD
  const convertDateToAPIFormat = (dateString: string): string => {
    if (!dateString) return "";
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    // If already in YYYY-MM-DD format, return as is
    if (dateString.includes("-") && dateString.split("-").length === 3) {
      return dateString;
    }
    return dateString;
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
    if (!formData.movementDate.trim()) {
      toast.error("يرجى إدخال تاريخ الحركة");
      return;
    }
    if (!formData.status) {
      toast.error("يرجى اختيار الحالة");
      return;
    }
    if (formData.status === "postponed" && !formData.postponementDate.trim()) {
      toast.error("يرجى إدخال تاريخ التأجيل");
      return;
    }

    try {
      // Prepare request body
      const requestBody: {
        location: string;
        customer_name: string;
        phone: string;
        movement_date: string;
        status: "completed" | "not-completed" | "postponed";
        follow_up_date?: string;
      } = {
        location: formData.location.trim(),
        customer_name: formData.customerName.trim(),
        phone: formData.phone.trim(),
        movement_date: convertDateToAPIFormat(formData.movementDate),
        status: formData.status as "completed" | "not-completed" | "postponed",
      };

      // Add follow_up_date only if status is postponed (set to today's date)
      if (formData.status === "postponed") {
        const today = new Date();
        const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        requestBody.follow_up_date = todayFormatted;
      }

      // Log request body for debugging
      console.log("Request Body:", requestBody);

      const response = await createDailyMovementMutation.mutateAsync(requestBody);

      // Invalidate daily movements query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["daily-movements"] });

      // Show success message from API response or default message
      toast.success(response.message || "تم إنشاء الحركة اليومية بنجاح");
      
      // Redirect to daily movements list
      router.push("/sales/daily-movement");
    } catch (error) {
      console.error("Failed to create daily movement:", error);
      toast.error("فشل إنشاء الحركة اليومية. يرجى المحاولة مرة أخرى");
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
          <Label htmlFor="movementDate">تاريخ الحركة</Label>
          <Popover open={movementCalendarOpen} onOpenChange={setMovementCalendarOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id="movementDate"
                  type="text"
                  placeholder="----/--/--"
                  value={formData.movementDate}
                  onChange={(e) => handleInputChange("movementDate", e.target.value)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedMovementDate}
                onSelect={handleMovementDateSelect}
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
              <SelectValue placeholder="حدد هل تم أخذ القياس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">تم أخذ القياس</SelectItem>
              <SelectItem value="not-completed">لم يتم أخذ القياس</SelectItem>
              <SelectItem value="postponed">مؤجل</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-start pt-4 gap-2">
        <Button
          type="submit"
          className="bg-[#3675AF] text-white hover:bg-[#3675AF]/90 px-8"
          disabled={createDailyMovementMutation.isPending}
        >
          {createDailyMovementMutation.isPending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
