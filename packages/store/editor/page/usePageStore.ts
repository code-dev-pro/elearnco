import { nanoid } from "lib/utils";
import {
  CompleteBlock,
  CompletePage,
  DraggableBlockType,
  ErrorResponse,
  FetchResponse,
  TPoint,
} from "schemas";
import { create } from "zustand";
import { PageService } from "lib/requests/services/pages";
import { actionAddBlock, mockBlockData } from "./actions";

export interface Action {
  action?: string;
}

export interface State {
  blocks: Partial<CompleteBlock & Action>[];
  activeBlock: string;
  prevState: Partial<CompleteBlock>[];
  isLoading: boolean;
  error: unknown;
  page: CompletePage;
  currentPage: number;
  totalBlocks: number;
  currentMoveBlock: { isMoving: boolean; id: string; position: TPoint };
  deletedBlockIds: string[];
}

interface Actions {
  fetchData: (id: string) => Promise<void>;
  getBlocksSnapshot: () => void;
  addBlock: (index: number, draggedBlockType: DraggableBlockType) => void;
  removeBlock: (uuid: string) => void;
  duplicateBlock: (uuid: string) => void;
  updateBlock: (
    data: Partial<CompleteBlock>,
    bloc: CompleteBlock
  ) => Promise<FetchResponse | ErrorResponse>;
  moveDown: (uuid: string) => void;
  moveUp: (uuid: string) => void;
  reorderBlock: (
    blockIndex: number,
    draggedBlockType: Partial<CompleteBlock>
  ) => void;
  setActiveBlock: (uuid: string) => void;
  setBlock: (blocks: Partial<CompleteBlock>[]) => void;

  moveStartBlockInGraph: (
    isMoving: boolean,
    id: string,
    position: TPoint
  ) => void;
}

const INITIAL_STATE: State = {
  blocks: [],
  prevState: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalBlocks: 1,
  page: {} as CompletePage,
  activeBlock: "",
  currentMoveBlock: { isMoving: false, id: "", position: { x: 0, y: 0 } },
  deletedBlockIds: [],
};

export const usePageStore = create<State & Actions>((set, get) => ({
  prevState: INITIAL_STATE.blocks,
  blocks: INITIAL_STATE.blocks,
  isLoading: INITIAL_STATE.isLoading,
  error: INITIAL_STATE.error,
  currentPage: INITIAL_STATE.currentPage,
  totalBlocks: INITIAL_STATE.totalBlocks,
  page: INITIAL_STATE.page,
  activeBlock: INITIAL_STATE.activeBlock,
  currentMoveBlock: INITIAL_STATE.currentMoveBlock,
  deletedBlockIds: INITIAL_STATE.deletedBlockIds,

  getBlocksSnapshot: (): State => {
    let prevState: State = get();
    return prevState;
  },
  fetchData: async (id: string): Promise<void> => {
    try {
      set({ error: null, isLoading: true });
      const { status, data } = await PageService.getPage(id);
      const { page } = data as { page: CompletePage[] };
      const { blocks } = page[0] as CompletePage & { blocks: [] };

    

      if (status === "success") {
        set(() => ({
          page: page[0],
          blocks: blocks,
          isLoading: false,
          totalBlocks: blocks.length,
          prevState: blocks,
        }));
      } else {
        set({ error: "error", isLoading: false });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  setBlock(blocks):void {
    set(() => {
      return { blocks: blocks };
    });
  },

  addBlock: (index: number, blocType: DraggableBlockType):void => {
    const snapshotPage = get().page;
    const { BLOCK_DATA } = mockBlockData(index, blocType, snapshotPage.id);
    set((state) => {
      const updatedBlocks = actionAddBlock(state.blocks, BLOCK_DATA, index); 
      return { blocks: updatedBlocks };
    });
  },
  removeBlock: (uuid: string):void => {
    set((state) => {
      const blockToRemove = state.blocks.find((block) => block.uuid === uuid);
      if (!blockToRemove) return state;

      const updatedBlocks = state.blocks
        .map((block) => {
          if (block.uuid === uuid) {
            return { ...block, action: "delete" };
          }
          return block;
        })
        .filter((block) => block.uuid !== uuid)
        .map((block, index) => {
          return { ...block, index, action: "update" };
        });

      return {
        blocks: updatedBlocks,
        deletedBlockIds: [...state.deletedBlockIds, uuid],
      };
    });
  },
  duplicateBlock: (uuid: string):void => {
    set((state) => {
      const originalBlock = state.blocks.find((block) => block.uuid === uuid);
      if (!originalBlock) return state;

      const index = state.blocks.findIndex((block) => block.uuid === uuid);
      const nextBlockIndex = index + 1;
      const updatedBlocks = state.blocks.map((block) => {
        if (block.index && block.index >= nextBlockIndex) {
          return { ...block, index: block.index + 1, action: "update" };
        }
        return block;
      });

      updatedBlocks.splice(nextBlockIndex, 0, {
        ...originalBlock,
        uuid: nanoid(12),
        index: nextBlockIndex,
        action: "create",
      });

      return { blocks: updatedBlocks };
    });
  },
  reorderBlock: (
    blockIndex: number,
    draggedBlockType: Partial<CompleteBlock>
  ) => {
    set((state) => {
      const currentIndex = state.blocks.findIndex(
        (block) => block.uuid === draggedBlockType.uuid
      );
      if (
        currentIndex === -1 ||
        blockIndex < 0 ||
        blockIndex >= state.blocks.length ||
        currentIndex === blockIndex
      ) {
        return state;
      }

      const updatedBlocks = [...state.blocks];
      const movedBlock = updatedBlocks[currentIndex];
      updatedBlocks.splice(currentIndex, 1);
      updatedBlocks.splice(blockIndex, 0, movedBlock);

      const startIndex = Math.min(currentIndex, blockIndex);
      const endIndex = Math.max(currentIndex, blockIndex);
      for (let i = startIndex; i <= endIndex; i++) {
        updatedBlocks[i] = { ...updatedBlocks[i], index: i, action: "update" };
      }

      return { blocks: updatedBlocks };
    });
  },
  moveDown: (uuid: string):void => {
    set((state) => {
      const index = state.blocks.findIndex((block) => block.uuid === uuid);
      if (index === -1 || index === state.blocks.length - 1) return state;

      const updatedBlocks = [...state.blocks];
      const tempBlock = updatedBlocks[index];
      updatedBlocks[index] = updatedBlocks[index + 1];
      updatedBlocks[index + 1] = tempBlock;

      updatedBlocks[index] = { ...updatedBlocks[index], index };
      updatedBlocks[index + 1] = {
        ...updatedBlocks[index + 1],
        index: index + 1,
      };

      updatedBlocks[index] = { ...updatedBlocks[index], action: "update" };
      updatedBlocks[index + 1] = {
        ...updatedBlocks[index + 1],
        action: "update",
      };

      return { blocks: updatedBlocks };
    });
  },
  moveUp: (uuid: string):void => {
    set((state) => {
      const index = state.blocks.findIndex((block) => block.uuid === uuid);
      if (index <= 0) return state;

      const updatedBlocks = [...state.blocks];
      const tempBlock = updatedBlocks[index];
      updatedBlocks[index] = updatedBlocks[index - 1];
      updatedBlocks[index - 1] = tempBlock;

      updatedBlocks[index] = { ...updatedBlocks[index], index };
      updatedBlocks[index - 1] = {
        ...updatedBlocks[index - 1],
        index: index - 1,
      };

      updatedBlocks[index] = { ...updatedBlocks[index], action: "update" };
      updatedBlocks[index - 1] = {
        ...updatedBlocks[index - 1],
        action: "update",
      };

      return { blocks: updatedBlocks };
    });
  },
  updateBlock: async (
    data: Partial<CompleteBlock>,
    block: Partial<CompleteBlock>
  ): Promise<FetchResponse | ErrorResponse> => {
    return { status: "success", data: { message: "" } };
  },
  setActiveBlock: (uuid: string): void => {
    set((state) => ({
      state,
      ...{
        activeBlock: uuid,
      },
    }));
  },
  moveStartBlockInGraph: (isMoving, id: string, position: TPoint): void => {
    set({
      currentMoveBlock: {
        isMoving,
        position,
        id,
      },
    });
  },
}));

export default usePageStore;
