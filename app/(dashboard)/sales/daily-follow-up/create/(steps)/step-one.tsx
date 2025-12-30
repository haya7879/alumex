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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, ChevronLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  onInputChange: (field: keyof BasicInfoFormData, value: string | number | boolean) => void;
  onSave: (formData: BasicInfoFormData) => Promise<number>;
  onNext: () => void;
}

export default function StepOne({
  formData,
  onInputChange,
  onSave,
  onNext,
}: StepOneProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [projectExists, setProjectExists] = useState<boolean | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFormId, setSavedFormId] = useState<number | null>(null);

  const checkProjectName = async () => {
    if (!formData.projectName.trim()) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }

    setIsChecking(true);
    setProjectExists(null);

    try {
      // Dummy API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate API response - randomly return true/false for demo
      const exists = Math.random() > 0.5;
      setProjectExists(exists);

      if (exists) {
        toast.warning("اسم المشروع موجود سابقاً، سيتم حفظه كنسخة مكررة");
        onInputChange("isDuplicate", true);
        // In real implementation, get parentId from API
        onInputChange("parentId", Math.floor(Math.random() * 1000));
      } else {
        toast.success("اسم المشروع صالح، يرجى تعبئة بقية الخانات");
        onInputChange("isDuplicate", false);
        // Remove parentId when project doesn't exist - set to 0 to clear it
        onInputChange("parentId", 0);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحقق من اسم المشروع");
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.approvedCompany || !formData.followUpEngineer || !formData.projectName) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    setIsSaving(true);
    try {
      const formId = await onSave(formData);
      setSavedFormId(formId);
      setShowSaveDialog(true);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ النموذج");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDialogResponse = (addNotes: boolean) => {
    setShowSaveDialog(false);
    if (addNotes) {
      onNext();
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="approvedCompany">الشركة المعتمدة</Label>
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
              disabled={isChecking || !formData.projectName.trim()}
              variant="outline"
              size="sm"
              className="min-w-[80px]"
            >
              {isChecking ? (
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
            <div className={`flex items-center gap-2 text-xs mt-1 ${projectExists ? 'text-orange-600' : 'text-green-600'}`}>
              {projectExists ? (
                <>
                  <AlertCircle className="size-4" />
                  <span>اسم المشروع موجود سابقاً، سيتم حفظه كنسخة مكررة</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>اسم المشروع صالح، يرجى تعبئة بقية الخانات</span>
                </>
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
          <p className="text-xs text-[#D32729] mt-1">
            انتبه لا يمكن تعديل التاريخ بعد انشاؤه الا بموافقة المدير
          </p>
        </div>
        <div className="space-y-2 col-span-4">
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
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? (
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
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تم حفظ النموذج بنجاح</DialogTitle>
            <DialogDescription>
              هل تريد إدخال الملاحظات المرتبطة بهذا المشروع؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-11! h-11"
              onClick={() => handleSaveDialogResponse(false)}
            >
              لا
            </Button>
            <Button className="w-11 h-11" onClick={() => handleSaveDialogResponse(true)}>
              نعم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
