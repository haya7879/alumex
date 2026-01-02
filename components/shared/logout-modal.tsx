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
import { useLogout } from "@/services/auth/auth-hooks";
import { useEffect } from "react";

export const LogoutModal = () => {
  const { isOpen, modalType, onClose } = useModalStore();
  const logoutMutation = useLogout();

  // Close modal after successful logout
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      onClose();
    }
  }, [logoutMutation.isSuccess, onClose]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={isOpen && modalType === EModalType.LOGOUT}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
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
            type="button"
            onClick={handleLogout}
            className="bg-[#0A3158] text-white hover:bg-[#0A3158]/90 px-3"
            disabled={logoutMutation.isPending}
            isLoading={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "جاري تسجيل الخروج..." : "نعم"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={logoutMutation.isPending}
          >
            لا
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
