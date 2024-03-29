"use client";
import React from "react";
import { DraggableBlockType } from "schemas";

import { BlocCardTextUI } from "./BlockCardLabelUI";

export const BlockCardUI = (
  props: {
    draggedBlockType: DraggableBlockType | undefined;
    category: string;
    onMouseDown: (
      e:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.TouchEvent<HTMLDivElement>,
      type: DraggableBlockType
    ) => void;
  } & { type: DraggableBlockType }
) => {
  const { type, onMouseDown, category, draggedBlockType } = props;

  return (
    <BlocCardTextUI
      draggedBlockType={draggedBlockType}
      category={category}
      type={type}
      onMouseDown={onMouseDown}
    />
  );
};
