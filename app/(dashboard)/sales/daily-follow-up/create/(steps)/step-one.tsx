"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ConfirmationDialog } from "../../../_components/dialogs/confirmation-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthorizedCompanies } from "@/services/kpis/kpis-hooks";
import {
  useCheckProjectName,
  useSalesAgents,
  useCreateForm,
} from "@/services/sales/sales-hooks";
import { useDateConverter } from "@/hooks/use-date-converter";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useDateSync } from "@/hooks/use-date-sync";

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
  isDuplicate?: boolean;
  parentId?: number;
}

interface StepOneProps {
  formData: BasicInfoFormData;
  onInputChange: (
    field: keyof BasicInfoFormData,
    value: string | number | boolean
  ) => void;
  onSave?: (formData: BasicInfoFormData) => Promise<number>;
  onFormIdChange?: (formId: number) => void;
  onNext: () => void;
}

export default function StepOne({
  formData,
  onInputChange,
  onNext,
}: StepOneProps) {
  const router = useRouter();
  const [projectExists, setProjectExists] = useState<boolean | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFormId, setSavedFormId] = useState<number | null>(null);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [dateCalendarOpen, setDateCalendarOpen] = useState(false);

  const { formatDateToDisplay, parseDateFromString, convertDateToAPIFormat } =
    useDateConverter();
  const { selectedDate, setSelectedDate } = useDateSync(formData.date);
  const { copyToClipboard, copied } = useCopyToClipboard();
  const { data: authorizedCompanies, isLoading: isLoadingCompanies } =
    useAuthorizedCompanies();
  const { data: salesAgents, isLoading: isLoadingAgents } = useSalesAgents();
  const checkProjectNameMutation = useCheckProjectName();
  const createFormMutation = useCreateForm();
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = formatDateToDisplay(date);
      onInputChange("date", formattedDate);
      setDateCalendarOpen(false);
    }
  };

  const checkProjectName = async () => {
    if (!formData.projectName.trim()) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }

    setProjectExists(null);

    try {
      const response = await checkProjectNameMutation.mutateAsync(
        formData.projectName.trim()
      );

      setProjectExists(response.exists);

      if (response.exists && response.original) {
        setSerialNumber(response.original.serial_number);
        onInputChange("isDuplicate", true);
        onInputChange("parentId", response.original.id);
      } else {
        setSerialNumber(null);
        toast.success("اسم المشروع صالح، يرجى تعبئة بقية الخانات");
        onInputChange("isDuplicate", false);
        onInputChange("parentId", 0);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحقق من اسم المشروع");
      console.error(error);
      setProjectExists(null);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (
      !formData.approvedCompany ||
      !formData.followUpEngineer ||
      !formData.projectName ||
      !formData.delegate ||
      !formData.projectCategory ||
      !formData.projectStage ||
      !formData.date ||
      !formData.address
    ) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    setIsSaving(true);
    try {
      // Prepare request body
      const requestBody = {
        authorized_company_id: parseInt(formData.approvedCompany),
        engineer_name: formData.followUpEngineer,
        sales_agent_id: parseInt(formData.delegate),
        form_name: formData.projectName,
        phone1: formData.phoneNumber || "",
        phone2: formData.phoneNumber2 || undefined,
        project_type: formData.projectCategory,
        project_stage: formData.projectStage,
        entry_date: convertDateToAPIFormat(formData.date),
        address: formData.address,
        ...(formData.parentId && formData.parentId > 0
          ? { parent_id: formData.parentId }
          : {}),
      };

      const response = await createFormMutation.mutateAsync(requestBody);
      setSavedFormId(response.data.id);
      setSerialNumber(response.data.serial_number);
      setShowSaveDialog(true);
      toast.success(response.message || "تم حفظ النموذج بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ النموذج");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDialogResponse = (addNotes: boolean) => {
    setShowSaveDialog(false);
    if (addNotes && savedFormId) {
      // Update URL with form_id
      router.push(
        `/sales/daily-follow-up/create?form_id=${savedFormId}&step=2`
      );
      onNext();
    }
  };

  const handleCopySerialNumber = async () => {
    if (!serialNumber) return;
    await copyToClipboard(serialNumber, "تم نسخ الرقم التسلسلي", 2000);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="approvedCompany">الشركة المعتمدة</Label>
          <Select
            value={formData.approvedCompany}
            onValueChange={(value) => onInputChange("approvedCompany", value)}
            disabled={isLoadingCompanies}
          >
            <SelectTrigger id="approvedCompany">
              <SelectValue placeholder="الشركة المعتمدة للمشروع" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCompanies ? (
                <SelectItem value="loading" disabled>
                  جاري التحميل...
                </SelectItem>
              ) : authorizedCompanies && authorizedCompanies.length > 0 ? (
                authorizedCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-data" disabled>
                  لا توجد شركات متاحة
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="followUpEngineer">المهندس المشرف</Label>
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
            disabled={isLoadingAgents}
          >
            <SelectTrigger id="delegate">
              <SelectValue placeholder="أختر المندوب من القائمة" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingAgents ? (
                <SelectItem value="loading" disabled>
                  جاري التحميل...
                </SelectItem>
              ) : salesAgents && salesAgents.length > 0 ? (
                salesAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-data" disabled>
                  لا يوجد مندوبون متاحون
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectName">اسم المشروع</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="projectName"
              placeholder="الشركة المعتمدة _ _ المهندس المتابع"
              value={formData.projectName}
              onChange={(e) => {
                onInputChange("projectName", e.target.value);
                setProjectExists(null);
              }}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={checkProjectName}
              disabled={
                checkProjectNameMutation.isPending ||
                !formData.projectName.trim()
              }
              variant="outline"
              size="sm"
              className="min-w-[80px]"
            >
              {checkProjectNameMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="size-4 ml-2" />
                  تحقق
                </>
              )}
            </Button>
          </div>
          {projectExists !== null && (
            <div
              className={`space-y-2 ${
                projectExists ? "text-yellow-500" : "text-green-600"
              }`}
            >
              {projectExists ? (
                <div className="space-y-2">
                  <div className="text-xs">
                    <div className="mb-1">
                      <span>
                        يبدو أن الاسم موجود سابقا برقم تسلسلي :{" "}
                        <span className="text-gray-600 dark:text-gray-100">
                          {serialNumber}
                        </span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCopySerialNumber}
                        className="h-6 w-6 mt-0.5 mx-0.5"
                        title="نسخ الرقم التسلسلي"
                      >
                        {copied ? (
                          <Check className="size-3 text-green-600" />
                        ) : (
                          <Copy className="size-3 text-gray-600 dark:text-gray-100" />
                        )}
                      </Button>
                    </div>
                    <div className="text-yellow-500">
                      تابع ادخال الفورم في حال أردت ادخال هذا النموذج ك نموذج
                      مكرر
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="size-4" />
                  <span>اسم المشروع صالح، يرجى تعبئة بقية الخانات</span>
                </div>
              )}
            </div>
          )}
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
              <SelectItem value="منزل">منزل</SelectItem>
              <SelectItem value="بناية">بناية</SelectItem>
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
              <SelectItem value="جاهز">جاهز</SelectItem>
              <SelectItem value="هيكل">هيكل</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">التاريخ</Label>
          <Popover open={dateCalendarOpen} onOpenChange={setDateCalendarOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id="date"
                  type="text"
                  placeholder="----/--/--"
                  value={formData.date}
                  onChange={(e) => {
                    onInputChange("date", e.target.value);
                    const parsedDate = parseDateFromString(e.target.value);
                    setSelectedDate(parsedDate);
                  }}
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
          <p className="text-xs text-yellow-500 mt-1">
            انتبه لا يمكن تعديل التاريخ بعد انشاؤه الا بموافقة المدير
          </p>
        </div>
        <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-4">
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

      <div className="flex justify-start gap-4 pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving || createFormMutation.isPending}
          className="min-w-[100px]"
        >
          {isSaving || createFormMutation.isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ"
          )}
        </Button>
      </div>

      {/* Save Dialog - Ask about notes */}
      <ConfirmationDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        title="تم حفظ النموذج بنجاح"
        description="هل تريد إدخال الملاحظات المرتبطة بهذا المشروع؟"
        onConfirm={() => handleSaveDialogResponse(true)}
        onCancel={() => handleSaveDialogResponse(false)}
      />
    </>
  );
}
