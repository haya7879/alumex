"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCreateSection } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface SectionFormData {
  sectionName: string;
  status: string;
}

export default function CreateSectionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createSectionMutation = useCreateSection();
  const [formData, setFormData] = useState<SectionFormData>({
    sectionName: "",
    status: "",
  });

  const handleInputChange = (field: keyof SectionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sectionName.trim()) {
      toast.error("يرجى إدخال اسم المقطع");
      return;
    }
    try {
      await createSectionMutation.mutateAsync({
        name: formData.sectionName.trim(),
      });

      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("تم إنشاء المقطع بنجاح");
      router.push("/sales/sections");
    } catch (error) {
      console.error("Failed to create section:", error);
      toast.error("فشل إنشاء المقطع. يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-5">
      {/* Section Name */}
      <div className="space-y-2 md:w-1/3 w-full">
        <Label htmlFor="sectionName">اسم المقطع</Label>
        <Input
          id="sectionName"
          placeholder="ادخل اسم المقطع هنا"
          value={formData.sectionName}
          onChange={(e) => handleInputChange("sectionName", e.target.value)}
        />
      </div>
      <div className="flex justify-start pt-4 gap-2">
        <Button
          type="submit"
          className="bg-[#3675AF] text-white hover:bg-[#3675AF]/90 px-8"
          disabled={createSectionMutation.isPending}
        >
          {createSectionMutation.isPending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
