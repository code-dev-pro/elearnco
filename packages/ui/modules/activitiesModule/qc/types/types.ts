import { TextBlockType } from "schemas";

export type TListItem = "decimal" | "lower-latin" | "lower-roman";

export interface TExItem {
  deleteItem?: (id: string) => void;
  updateRandom?: (id: string, value: boolean) => void;
  updateItem?: (id: string, data: {content:string,type:TextBlockType}) => void;
  type: string;
}

export interface IItem {
  editable: boolean;
  content: any;
  id: string;
  isGood: boolean;
}

// export interface IListItem {
//   type: TListItem;
// }

export interface IProps {
  data: { data: IItem[]; type: TListItem; isRandom: boolean };
  isReadOnly: boolean;
  onChange: (data: {content:string,type:TextBlockType.PARAGRAH} | { data: IItem[]; type: TListItem; isRandom: boolean }) => void;
}
export interface IMarker {
  isSelected: boolean;
  type: string;
}
