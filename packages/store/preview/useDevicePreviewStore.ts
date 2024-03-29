import { EDeviceLayouts } from "schemas";
import { create } from "zustand";

export interface devicePreviewStore {
  onSetDevice: (device: string) => void;
  device: string;
}

export const useDevicePreviewStore = create<devicePreviewStore>((set) => ({
  onSetDevice: (device: string) => set({ device: device }),
  device:  EDeviceLayouts.desktopM,
}));
