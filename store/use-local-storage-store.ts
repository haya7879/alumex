import { create } from "zustand";
import { StorageService } from "@/lib/storage-service";

interface LocalStorageStore {
  user: any | null;
  setUser: (user: any) => void;
}

export const useLocalStorageStore = create<LocalStorageStore>((set) => ({
  user: typeof window !== "undefined" ? StorageService.getUser() : null,
  setUser: (user) => set({ user }),
}));

