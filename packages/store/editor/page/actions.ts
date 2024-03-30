import { nanoid } from "lib";
import { CompleteBlock, DraggableBlockType } from "schemas";
import { Action } from "./usePageStore";

export const mockBlockData = (
  index: number,
  blocType?: DraggableBlockType,
  pageId?: string
) => {
  const BLOCK_DATA = {
    uuid: nanoid(12),
    index: index,
    type: blocType,
    groupId: nanoid(7),
    pageId: pageId,
  };
  // we mock data node block
  const NODE_DATA = {
    uuid: nanoid(12),
    title: "",
    description: "",
    type: "paragraph",
    content: { content: "" },
  };

  return { BLOCK_DATA, NODE_DATA };
};
export const actionAddBlock = (
  state: Partial<CompleteBlock & Action>[],
  BLOCK_DATA: Partial<CompleteBlock>,
  index: number
): Partial<CompleteBlock & Action>[] => {
  const updatedBlocks = state.map((block) => {
    if (block.index !== undefined && block.index >= index) {
      return { ...block, index: block.index + 1, action: "update" };
    }
    return block;
  });

  updatedBlocks.splice(index, 0, {
    ...BLOCK_DATA,
    index,
    action: "create",
  });

  return updatedBlocks;
};
