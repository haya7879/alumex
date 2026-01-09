"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { FormDetailsData, UpdateFormBasicInfoRequest } from "@/services/sales/sales-services";
import { useAuthorizedCompanies } from "@/services/kpis/kpis-hooks";
import { useSalesAgents } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface EditBasicInfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormDetailsData | null;
  onConfirm: (data: UpdateFormBasicInfoRequest) => Promise<void>;
  isPending: boolean;
}

export function EditBasicInfoSheet({
  open,
  onOpenChange,
  formData,
  onConfirm,
  isPending,
}: EditBasicInfoSheetProps) {
  const [formValues, setFormValues] = useState<UpdateFormBasicInfoRequest>({
    authorized_company_id: 0,
    sales_agent_id: 0,
    engineer_name: "",
    form_name: "",
    phone1: "",
    phone2: "",
    project_type: "",
    project_stage: "",
    address: "",
  });

  const { data: authorizedCompanies } = useAuthorizedCompanies();
  const { data: salesAgents } = useSalesAgents();

  // Initialize form values when formData changes
  useEffect(() => {
    if (formData && open) {
      setFormValues({
        authorized_company_id: formData.authorized_company.id,
        sales_agent_id: formData.sales_agent.id,
        engineer_name: formData.engineer_name,
        form_name: formData.form_name,
        phone1: formData.phones.phone1,
        phone2: formData.phones.phone2 || "",
        project_type: formData.project.type,
        project_stage: formData.project.stage,
        address: formData.address,
      });
    }
  }, [formData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formValues.authorized_company_id ||
      !formValues.sales_agent_id ||
      !formValues.engineer_name ||
      !formValues.form_name ||
      !formValues.phone1 ||
      !formValues.project_type ||
      !formValues.project_stage ||
      !formValues.address
    ) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    try {
      await onConfirm({
        ...formValues,
        phone2: formValues.phone2 || undefined,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "حدث خطأ أثناء التعديل";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!formData) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>تعديل المعلومات الأساسية</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <X className="size-4" />
                </Button>
              </SheetClose>
            </div>
            <SheetDescription>تعديل معلومات النموذج الأساسية</SheetDescription>
          </SheetHeader>
          <div className="text-center py-12 text-muted-foreground">
            جاري التحميل...
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>تعديل المعلومات الأساسية</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="size-4" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription>تعديل معلومات النموذج الأساسية</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* اسم المشروع */}
            <div className="space-y-2">
              <Label htmlFor="form_name">اسم المشروع</Label>
              <Input
                id="form_name"
                placeholder="أدخل اسم المشروع"
                value={formValues.form_name}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, form_name: e.target.value }))
                }
                required
              />
            </div>

            {/* اسم المهندس */}
            <div className="space-y-2">
              <Label htmlFor="engineer_name">اسم المهندس</Label>
              <Input
                id="engineer_name"
                placeholder="أدخل اسم المهندس"
                value={formValues.engineer_name}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, engineer_name: e.target.value }))
                }
                required
              />
            </div>

            {/* الشركة المصرحة */}
            <div className="space-y-2">
              <Label htmlFor="authorized_company_id">الشركة المصرحة</Label>
              <Select
                value={formValues.authorized_company_id > 0 ? formValues.authorized_company_id.toString() : ""}
                onValueChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    authorized_company_id: parseInt(value),
                  }))
                }
              >
                <SelectTrigger id="authorized_company_id">
                  <SelectValue placeholder="اختر الشركة المصرحة" />
                </SelectTrigger>
                <SelectContent>
                  {authorizedCompanies?.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* مندوب المبيعات */}
            <div className="space-y-2">
              <Label htmlFor="sales_agent_id">مندوب المبيعات</Label>
              <Select
                value={formValues.sales_agent_id > 0 ? formValues.sales_agent_id.toString() : ""}
                onValueChange={(value) =>
                  setFormValues((prev) => ({
                    ...prev,
                    sales_agent_id: parseInt(value),
                  }))
                }
              >
                <SelectTrigger id="sales_agent_id">
                  <SelectValue placeholder="اختر مندوب المبيعات" />
                </SelectTrigger>
                <SelectContent>
                  {salesAgents?.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* رقم الهاتف 1 */}
            <div className="space-y-2">
              <Label htmlFor="phone1">رقم الهاتف 1</Label>
              <Input
                id="phone1"
                placeholder="مثال: 0599999999"
                value={formValues.phone1}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, phone1: e.target.value }))
                }
                required
              />
            </div>

            {/* رقم الهاتف 2 */}
            <div className="space-y-2">
              <Label htmlFor="phone2">رقم الهاتف 2 (اختياري)</Label>
              <Input
                id="phone2"
                placeholder="مثال: 0599999999"
                value={formValues.phone2}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, phone2: e.target.value }))
                }
              />
            </div>

            {/* نوع المشروع */}
            <div className="space-y-2">
              <Label htmlFor="project_type">نوع المشروع</Label>
              <Select
                value={formValues.project_type || ""}
                onValueChange={(value) =>
                  setFormValues((prev) => ({ ...prev, project_type: value }))
                }
              >
                <SelectTrigger id="project_type">
                  <SelectValue placeholder="اختر نوع المشروع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="منزل">منزل</SelectItem>
                  <SelectItem value="بناية">بناية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* مرحلة المشروع */}
            <div className="space-y-2">
              <Label htmlFor="project_stage">مرحلة المشروع</Label>
              <Select
                value={formValues.project_stage || ""}
                onValueChange={(value) =>
                  setFormValues((prev) => ({ ...prev, project_stage: value }))
                }
              >
                <SelectTrigger id="project_stage">
                  <SelectValue placeholder="اختر مرحلة المشروع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="جاهز">جاهز</SelectItem>
                  <SelectItem value="هيكل">هيكل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* العنوان */}
          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Textarea
              id="address"
              placeholder="أدخل العنوان"
              value={formValues.address}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, address: e.target.value }))
              }
              rows={3}
              required
            />
          </div>

          <SheetFooter className="mt-6 flex-row items-center gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              إلغاء
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
