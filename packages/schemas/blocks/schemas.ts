import { ActivityBlockType } from "./activity";
import { LogicBlockType } from "./logic";
import { MediaBlockType } from "./media";
import { TextBlockType } from "./text";

export type BlockType =
  | TextBlockType
  | MediaBlockType
  | LogicBlockType
  | ActivityBlockType;

export type DraggableBlockType =
  | TextBlockType
  | MediaBlockType
  | LogicBlockType
  | ActivityBlockType;

export type DraggableBlock =
  | TextBlockType
  | MediaBlockType
  | LogicBlockType
  | ActivityBlockType;

export enum BlockCategories {
  "text" = "text",
  "media" = "media",
  "activity" = "activity",
  "logic" = "logic",
}

export  interface IBlock {
  blockID:string;
  type:string
} 

/*----------------------------------------------------------------
/** we can unlock the Blocks At Each End Of Development Of This 
----------------------------------------------------------------*/
export const isBlockIsDev = [
  "title",
  "paragraph",
   "title",
   "subtitle",
  "paragraph",
   "citation",
   "warning",
   "conclusion",
   "definition",
   "memorisation",
  "theoreme",
   "example",
  /* 'maths',
   "link", */
  "wheel",
  "multiple choice",
  "image",
  "video",
  "audio"
];
