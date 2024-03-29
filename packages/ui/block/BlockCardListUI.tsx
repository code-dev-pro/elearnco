import React from "react";
import { DraggableBlockType } from "schemas";

import { BlockCardUI } from "./BlockCardUI";
import { IProps } from "./types";



export const BlockCardList = (props: IProps) => {
  const { blockType, onMouseDown, section, category, draggedBlockType } = props;
  const BLOCKS  = Object.values(blockType) as DraggableBlockType[];

 

  return (
    <>
      <h2 className="font-semibold tracking-tight py-2 px-2 text-left text-sm">
        {section}
      </h2>
      <div className="grid grid-cols-2 gap-3 p-2">
        {BLOCKS.map((type: DraggableBlockType) => (
          <BlockCardUI
            key={type}
            type={type}
            onMouseDown={onMouseDown}
            category={category}
            draggedBlockType={draggedBlockType}
          />
        ))}
      </div>
    </>
  );
};
