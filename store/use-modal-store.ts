import { create } from "zustand";

export enum EModalType {
  LOGOUT = "LOGOUT",
}

interface ModalStore {
  isOpen: boolean;
  modalType: EModalType | null;
  onOpen: (type: EModalType) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalType: null,
  onOpen: (type) => set({ isOpen: true, modalType: type }),
  onClose: () => set({ isOpen: false, modalType: null }),
}));

