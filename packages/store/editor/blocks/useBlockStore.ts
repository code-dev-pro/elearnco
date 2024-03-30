import { create } from "zustand";
import { CompleteBlock, CompleteBlockNode, ErrorResponse } from "schemas";
import { BlockNodeService } from "lib";
import { mountStoreDevtool } from "simple-zustand-devtools";
interface State {
  block: Partial<CompleteBlock>;
  isLoading: boolean;
  error: unknown;
}

interface Actions {
  fetchData: (id: string) => void;
  updateBlock: (blockID: string, data: Partial<CompleteBlock>) => void;
}

const INITIAL_STATE: State = {
  block: {} as CompleteBlock,
  isLoading: false,
  error: null,
};

export const useBlockStore = create<State & Actions>((set, get) => ({
  block: INITIAL_STATE.block,
  isLoading: INITIAL_STATE.isLoading,
  error: INITIAL_STATE.error,

  fetchData: async (id: string): Promise<void> => {
    try {
      set({ error: null, isLoading: true });
      const { status, data } = await BlockNodeService.getBlockNode(id);

      if (status === "success") {
        set({
          block: data as CompleteBlock,
          isLoading: false,
          error: null,
        });
      } else {
        set({ error: "error", isLoading: false });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  updateBlock: async (blockID: string, data: Partial<CompleteBlock>) => {
    set({ block: data });
    const reponse = BlockNodeService.updateBlockNode({
      id: blockID,
      ...{ content: data },
    });
  },
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useBlockStore);
}
