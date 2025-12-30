"use client";

import { useModalStore, EModalType } from "@/store/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export const LogoutModal = () => {
  const { isOpen, modalType, onClose } = useModalStore();

  return (
    <Dialog
      open={isOpen && modalType === EModalType.LOGOUT}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تسجيل خروج</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من تسجيل الخروج ؟
          </DialogDescription>
        </DialogHeader>
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
            // onClick={() => router.back()}
            className="px-8"
          >
            الغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
