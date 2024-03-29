import { createWithEqualityFn } from "zustand/traditional";
import { persist } from "zustand/middleware";
import { TPoint } from "schemas";
export type IdMap<T> = { [id: string]: T };
export type CoordinatesMap = IdMap<TPoint>;
type Store = {
  isDraggingGraph: boolean;
  isLockGraph: boolean;

  setIsDraggingGraph: (isDragging: boolean) => void;
  setIsLockGraph: (isDragging: boolean) => void;
};

export const useGroupsStore = createWithEqualityFn<Store>()(
  persist(
    (set, get) => ({
      isDraggingGraph: false,
      isLockGraph: false,
      setIsDraggingGraph: (isDragging) => set({ isDraggingGraph: isDragging }),
      setIsLockGraph: (isLock) => set({ isLockGraph: isLock }),
    }),
    {
      name: "store",
    }
  )
);
