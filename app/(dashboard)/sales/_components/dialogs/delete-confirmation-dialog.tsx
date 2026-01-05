"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteItem {
  id: number | string;
  [key: string]: any; // Allow any additional properties
}

interface DeleteConfirmationDialogProps<T extends DeleteItem> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: T[];
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemLabel?: string;
  renderItem?: (item: T) => React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
}

export function DeleteConfirmationDialog<T extends DeleteItem>({
  open,
  onOpenChange,
  items,
  onConfirm,
  title = "تأكيد الحذف",
  description,
  itemLabel = "سطر",
  renderItem,
  confirmLabel = "حذف",
  cancelLabel = "إلغاء",
  isPending = false,
}: DeleteConfirmationDialogProps<T>) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const defaultDescription = `هل أنت متأكد من حذف ${items.length} ${itemLabel}؟`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        {items.length > 0 && (
          <div className="max-h-60 overflow-y-auto space-y-1">
            {items.map((item) => (
              <div key={item.id} className="text-sm p-2 rounded">
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <div>{JSON.stringify(item)}</div>
                )}
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

