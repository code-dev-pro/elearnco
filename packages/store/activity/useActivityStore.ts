import { create } from "zustand";

export interface ActivityStore {
  isActivity: boolean;
  onStopActivity: () => void;
  onBeginActivity: () => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  isActivity: false,
  onStopActivity: () => set({ isActivity: false }),
  onBeginActivity: () => set({ isActivity: true }),
}));
