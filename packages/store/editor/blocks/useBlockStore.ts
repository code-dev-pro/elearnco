import { create } from "zustand";
import { CompleteBlock, CompleteBlockNode, ErrorResponse } from "schemas";
import { BlockNodeService } from "lib";
import { mountStoreDevtool } from 'simple-zustand-devtools';
interface State {
  block: CompleteBlock;
  isLoading: boolean;
  error: unknown;
}

interface Actions {
  fetchData: (id: string) => void;
  updateBlock: (blockID: string, data: Partial<CompleteBlock>) => void;
}

const INITIAL_STATE: State = {
  block: {} as CompleteBlockNode,
  isLoading: false,
  error: null,
};

export const useBlockStore = create<State & Actions>((set:any, get:any) => ({
  block: INITIAL_STATE.block,
  isLoading: INITIAL_STATE.isLoading,
  error: INITIAL_STATE.error,

  fetchData: async (id: string): Promise<void> => {
    try {
      set({ error: null, isLoading: true });
      const { status, data } = await BlockNodeService.getBlockNode(id);

      
      // const { page } = data as { page: CompletePage[] };
      // const { blocks } = page[0] as CompletePage & { blocks: [] };

      if (status === "success") {
        set(() => ({
          block: { ...data },
          isLoading: false,
          error: null,
        }));
      } else {
        set({ error: "error", isLoading: false });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  updateBlock: async (blockID: string, data: Partial<CompleteBlock>) => {
    set(() => ({
      block: { ...data },
    }));
   
    const reponse = BlockNodeService.updateBlockNode({
      id: blockID,
      ...{ content: data },
    });

    
  },
  // addBlock: async (pageID, data): Promise<BlockResponse | ErrorResponse> => {
  //   const id = pageID;
  //   const blockData = {
  //     page: { connect: { id: id } },
  //     ...data,
  //   };

  //   try {
  //     const reponse = await addBlock(blockData);
  //     return reponse as BlockResponse;
  //   } catch (error: unknown) {
  //     return { status: "fail", data: {message:"error" }};
  //   }
  // },

  // deleteBlock: async (
  //   blockID: string
  // ): Promise<BlockResponse | ErrorResponse> => {
  //   try {
  //     const reponse = await deleteBlock(blockID);
  //     return reponse as BlockResponse;
  //   } catch (error: unknown) {
  //     return { status: "fail",data: {message:"error" } };
  //   }
  // },

  // updateBlock: async (data:Partial<CompleteBlock>): Promise<BlockResponse | ErrorResponse> => {

  //   try {
  //     const reponse = await updateBlock(data);
  //     return reponse as BlockResponse;
  //   } catch (error: unknown) {
  //     return { status: "fail", data: {message:"error" } };
  //   }
  // },
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool('Store', useBlockStore);
 
}

