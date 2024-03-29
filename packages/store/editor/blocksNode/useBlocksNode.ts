import { create } from "zustand";
import {
  BlockNodeResponse,
  CompleteBlockNode,
  ERoutes,
  ErrorResponse,
} from "schemas";
import { BlockNodeService } from "lib/requests/services/nodes";


interface State {
  blockNode: CompleteBlockNode;
  isLoading: boolean;
  error: unknown;
}

interface Actions {
  fetchData: (id: string) => Promise<BlockNodeResponse | ErrorResponse>;
  addBlockNode: (
    blockID: string,
    data: Partial<CompleteBlockNode>
  ) => Promise<BlockNodeResponse | ErrorResponse>;
  updateBlockNode: (
    data: Partial<CompleteBlockNode>
  ) => Promise<BlockNodeResponse | ErrorResponse>;
  deleteBlockNode: (
    blockID: string
  ) => Promise<BlockNodeResponse | ErrorResponse>;
}

const INITIAL_STATE: State = {
  blockNode: {} as CompleteBlockNode,
  isLoading: false,
  error: null,
};

export const useBlockNodeStore = create<State & Actions>(
  (set, get) => ({
    blockNode: INITIAL_STATE.blockNode,
    isLoading: INITIAL_STATE.isLoading,
    error: INITIAL_STATE.error,

    fetchData: async (
      id: string
    ): Promise<BlockNodeResponse | ErrorResponse> => {
      try {
        // set({ isLoading: true, error: null });

        const response = await fetch(`/api/${ERoutes.BLOCKNODE}/${id}`);
        const { data } = await response.json();

        set({
          blockNode: data,
          isLoading: false,
        });
        return { status: "success", data: { message: data } };
      } catch (error) {
        return { status: "fail", data: { message: "error" } };
        //  set({ error, isLoading: false });
      }
    },

    addBlockNode: async (
      blockID: string,
      data: Partial<CompleteBlockNode>
    ): Promise<BlockNodeResponse | ErrorResponse> => {
      const blockNodeData = {
        block: { connect: { id: blockID } },
        ...data,
      };

      try {
        const response = await BlockNodeService.addBlockNode(blockNodeData);
        return response as BlockNodeResponse;
      } catch (error: unknown) {
        return { status: "fail", data: { message: "error" } };
      }
    },
    deleteBlockNode: async (
      blockNodeID: string
    ): Promise<BlockNodeResponse | ErrorResponse> => {
      try {
        const response = await BlockNodeService.deleteBlockNode(blockNodeID);
        return response as BlockNodeResponse;
      } catch (error: unknown) {
        return { status: "fail", data: { message: "error" } };
      }
    },
    updateBlockNode: async (
      data
    ): Promise<BlockNodeResponse | ErrorResponse> => {
      try {
        const reponse = await BlockNodeService.updateBlockNode(data);
        return reponse as BlockNodeResponse;
      } catch (error: unknown) {
        return { status: "fail", data: { message: "error" } };
      }
    },
  }))


// if (process.env.NODE_ENV === "development") {
//   //mountStoreDevtool('Store', useBlockNodeStore);
//   //@ts-ignore
//   window.store = zukeeper(useBlockNodeStore);
// }
