"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  onSectionNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isPending?: boolean;
  title?: string;
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

export function EditSectionDialog({
  open,
  onOpenChange,
  sectionName,
  onSectionNameChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isPending = false,
  title = "تعديل اسم المقطع",
  label = "تعديل اسم المقطع",
  placeholder = "ادخل اسم المقطع هنا",
  submitLabel = "حفظ",
  cancelLabel = "الغاء",
}: EditSectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            يرجى الانتظار...
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-sectionName">{label}</Label>
              <Input
                id="edit-sectionName"
                placeholder={placeholder}
                value={sectionName}
                onChange={(e) => onSectionNameChange(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                className="bg-[#0A3158] text-white hover:bg-[#0A3158]/90"
                disabled={isPending}
              >
                {isPending ? "جاري الحفظ..." : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

