import { create } from "zustand";
import {
  CompleteBlockNode,
  ERoutes,
  ErrorResponse,
  FetchResponse,
} from "schemas";
import { BlockNodeService } from "lib/requests/services/nodes";

interface State {
  blockNode: CompleteBlockNode;
  isLoading: boolean;
  error: unknown;
}

interface Actions {
  fetchData: (id: string) => Promise<FetchResponse | ErrorResponse>;
  addBlockNode: (
    blockID: string,
    data: Partial<CompleteBlockNode>
  ) => Promise<FetchResponse | ErrorResponse>;
  updateBlockNode: (
    data: Partial<CompleteBlockNode>
  ) => Promise<FetchResponse | ErrorResponse>;
  deleteBlockNode: (blockID: string) => Promise<FetchResponse | ErrorResponse>;
}

const INITIAL_STATE: State = {
  blockNode: {} as CompleteBlockNode,
  isLoading: false,
  error: null,
};

export const useBlockNodeStore = create<State & Actions>((set, get) => ({
  blockNode: INITIAL_STATE.blockNode,
  isLoading: INITIAL_STATE.isLoading,
  error: INITIAL_STATE.error,

  fetchData: async (id: string): Promise<FetchResponse | ErrorResponse> => {
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
      return { status: "failed", data: { message: "error" } };
      //  set({ error, isLoading: false });
    }
  },

  addBlockNode: async (
    blockID: string,
    data: Partial<CompleteBlockNode>
  ): Promise<FetchResponse | ErrorResponse> => {
    const blockNodeData = {
      block: { connect: { id: blockID } },
      ...data,
    };

    try {
      const response = await BlockNodeService.addBlockNode(blockNodeData);
      return response as FetchResponse;
    } catch (error: unknown) {
      return { status: "failed", data: { message: "error" } };
    }
  },
  deleteBlockNode: async (
    blockNodeID: string
  ): Promise<FetchResponse | ErrorResponse> => {
    try {
      const response = await BlockNodeService.deleteBlockNode(blockNodeID);
      return response as FetchResponse;
    } catch (error: unknown) {
      return { status: "failed", data: { message: "error" } };
    }
  },
  updateBlockNode: async (data): Promise<FetchResponse | ErrorResponse> => {
    try {
      const reponse = await BlockNodeService.updateBlockNode(data);
      return reponse as FetchResponse;
    } catch (error: unknown) {
      return { status: "failed", data: { message: "error" } };
    }
  },
}));
