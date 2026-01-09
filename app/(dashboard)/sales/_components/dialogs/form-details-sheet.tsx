"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Phone, MapPin, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FormDetailsResponse } from "@/services/sales/sales-services";
import { useDateConverter } from "@/hooks/use-date-converter";

interface FormDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formDetails: FormDetailsResponse | undefined;
  isLoading: boolean;
}

export function FormDetailsSheet({
  open,
  onOpenChange,
  formDetails,
  isLoading,
}: FormDetailsSheetProps) {
  const { formatDate } = useDateConverter();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>تفاصيل النموذج</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="size-4" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription>عرض جميع معلومات النموذج</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            جاري التحميل...
          </div>
        ) : formDetails?.data ? (
          <div className="mt-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">المعلومات الأساسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">اسم المشروع</p>
                  <p className="text-sm font-medium">{formDetails.data.form_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الرقم التسلسلي</p>
                  <p className="text-sm font-medium">{formDetails.data.serial_number}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">اسم المهندس</p>
                  <p className="text-sm font-medium">{formDetails.data.engineer_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">تاريخ الإدخال</p>
                  <p className="text-sm font-medium">{formatDate(formDetails.data.entry_date)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">نوع المشروع</p>
                  <p className="text-sm font-medium">{formDetails.data.project.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">مرحلة المشروع</p>
                  <p className="text-sm font-medium">{formDetails.data.project.stage}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الحالة</p>
                  <Badge variant={
                    formDetails.data.status === "rejected" ? "destructive" :
                    formDetails.data.status === "contracted" ? "success" :
                    formDetails.data.status === "quoted" ? "warning" : "default"
                  }>
                    {formDetails.data.status === "rejected" ? "مرفوض" :
                     formDetails.data.status === "contracted" ? "تم توقيع العقد" :
                     formDetails.data.status === "quoted" ? "تحول لعرض سعر" : "جديد"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الشركة المصرحة</p>
                  <p className="text-sm font-medium">{formDetails.data.authorized_company.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">مندوب المبيعات</p>
                  <p className="text-sm font-medium">{formDetails.data.sales_agent.name}</p>
                </div>
                {formDetails.data.parent && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">النموذج الأصلي</p>
                    <p className="text-sm font-medium">{formDetails.data.parent.serial_number}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">معلومات الاتصال</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">الهاتف 1</p>
                    <p className="text-sm font-medium">{formDetails.data.phones.phone1}</p>
                  </div>
                </div>
                {formDetails.data.phones.phone2 && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">الهاتف 2</p>
                      <p className="text-sm font-medium">{formDetails.data.phones.phone2}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">العنوان</p>
                    <p className="text-sm font-medium">{formDetails.data.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quotation Information */}
            {formDetails.data.quotation && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">عرض السعر</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">رقم العرض</p>
                    <p className="text-sm font-medium">{formDetails.data.quotation.offer_number}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">تاريخ العرض</p>
                    <p className="text-sm font-medium">{formatDate(formDetails.data.quotation.offer_date)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">القيمة الإجمالية</p>
                    <p className="text-sm font-medium">
                      {formDetails.data.quotation.total_value != null
                        ? Number(formDetails.data.quotation.total_value).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contract Information */}
            {formDetails.data.contract && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">معلومات العقد</h3>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">تاريخ توقيع العقد</p>
                  <p className="text-sm font-medium">{formatDate(formDetails.data.contract.contract_date)}</p>
                </div>
              </div>
            )}

            {/* Follow-ups */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">برنامج المتابعة</h3>
              {formDetails.data.follow_ups && formDetails.data.follow_ups.length > 0 ? (
                <div className="space-y-3">
                  {formDetails.data.follow_ups.map((followUp) => (
                    <div key={followUp.id} className="border rounded-lg p-4 space-y-2">
                      <p className="text-sm">{followUp.note}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="size-3" />
                          {followUp.user.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(followUp.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">لا توجد ملاحظات متابعة</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد بيانات للعرض
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
