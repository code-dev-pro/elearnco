import { ActivityBlockType,DraggableBlockType, LogicBlockType, MediaBlockType, TextBlockType } from "schemas";



export type IProps = {
    draggedBlockType: DraggableBlockType | undefined;
    blockType:
      | TextBlockType
      | MediaBlockType
      | LogicBlockType
      | ActivityBlockType;
    tooltip?: string;
    isDisabled?: boolean;
    section: string;
    category: string;
    onMouseDown: (
      e:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.TouchEvent<HTMLDivElement>,
      type: DraggableBlockType
    ) => void;
  };