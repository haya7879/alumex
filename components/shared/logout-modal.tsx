"use client";

import { useModalStore, EModalType } from "@/store/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const LogoutModal = () => {
  const { isOpen, modalType, onClose } = useModalStore();

  return (
    <Dialog open={isOpen && modalType === EModalType.LOGOUT} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Add logout logic here
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Logout
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

