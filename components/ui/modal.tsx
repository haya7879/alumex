"use client";
import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { EModalType } from "@/config/enums";
import { useModalStore } from "@/store/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMemo } from "react";

interface ModalProps {
  type: EModalType;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  variant?: "sheet" | "dialog";
}

export function Modal({
  type,
  title,
  description,
  children,
  className,
  variant = "sheet",
}: ModalProps) {
  const { isOpen, type: currentType, onClose } = useModalStore();
  const isOpenModal = useMemo(
    () => currentType === type && isOpen,
    [currentType, type, isOpen]
  );

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (variant === "dialog") {
    return (
      <Dialog open={isOpenModal} onOpenChange={onChange}>
        <DialogContent className={cn("pr-0", className)}>
          <ScrollArea className="h-full max-h-[80vh] pr-6">
            <DialogHeader className="pb-6">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Sheet open={isOpenModal} onOpenChange={onChange}>
      <SheetContent className={cn("", className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="h-full overflow-y-auto flex flex-col justify-between">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
