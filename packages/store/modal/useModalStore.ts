import { GenericObject } from "schemas";
import { create } from "zustand";

export interface GlobalModalStore {
  isOpen: boolean;
  action: string;
  data?: any;
  onClose: () => void;
  onOpen: (action: string, data?: any) => void;
}

export const useGlobalModalStore = create<GlobalModalStore>((set) => ({
  isOpen: false,
  action: "",
  data: {},
  onClose: () => set({ isOpen: false }),
  onOpen: (action: string, data?: GenericObject) =>
    set({ isOpen: true, action: action, data: data }),
}));
