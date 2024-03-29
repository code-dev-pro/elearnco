import { FolderService } from "lib";
import { getFolders } from "lib/requests/api.request";
import { filterFolderAlphabetic } from "lib/utils";
import { CompleteFolder } from "schemas";
import { create } from "zustand";

interface State {
  folders: CompleteFolder[];
  totalFolders: number;
  isLoading: boolean;
  error: unknown;
}

interface Actions {
  addFolder: (folder:Partial<CompleteFolder>) => void;
  deleteFolder: (folder: CompleteFolder) => void;
  fetchDataFolders: () => Promise<void>;
}

const INITIAL_STATE: State = {
  folders: [],
  totalFolders: 0,
  isLoading: true,
  error: null,
};

export const useFoldersStore = create<State & Actions>((set, get) => ({
  folders: INITIAL_STATE.folders,
  totalFolders: INITIAL_STATE.totalFolders,
  isLoading: INITIAL_STATE.isLoading,
  error: INITIAL_STATE.error,

  fetchDataFolders: async (): Promise<void> => {
    try {
      set({ isLoading: true, error: null });
      const folders = await getFolders();
      const { data } = folders as { data: CompleteFolder[] };
      const updateData = [
        ...data,
        { name: "All", id: "All", userId: "clq5fwoj60002090jih4fjzzd"},
      ] as CompleteFolder[];

      if (updateData) {
        set({
          folders: filterFolderAlphabetic(updateData) as CompleteFolder[],
          isLoading: false,
          totalFolders: data.length,
        });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  addFolder: async (folder: Partial<CompleteFolder>): Promise<void> => {
    const response = await FolderService.addFolder(folder);
    const { status, data } = response as {
      status: string;
      data: CompleteFolder;
    };

    set((state) => ({
      folders: [...state.folders, data].reverse(),
      totalFolders: state.totalFolders + 1,
    }));
  },
  deleteFolder: (Folder: Partial<CompleteFolder>): void => {
    set((state) => ({
      folders: state.folders.filter((item) => item.id !== Folder.id),
      totalFolders: state.totalFolders - 1,
    }));
  },
}));
