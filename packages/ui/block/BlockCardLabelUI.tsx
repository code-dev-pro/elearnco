import { Chip } from "@nextui-org/react";
import { changeCursor, getBlockColor, resetCursor } from "lib/utils";
import React, { useMemo } from "react";
import { DraggableBlockType, isBlockIsDev } from "schemas";

import { IconUI } from "../icon/IconUI";

type IProps = {
  draggedBlockType: DraggableBlockType | undefined;
  type: DraggableBlockType;
  category: string;
  onMouseDown: (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
    type: DraggableBlockType
  ) => void;
};
export const BlocCardTextUI = (props: IProps) => {
  const { onMouseDown, type, category, draggedBlockType } = props;

  const _handleMouseDown = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ): void => onMouseDown(e, type as DraggableBlockType);

  const BACKGROUND_COLOR = useMemo(
    () => getBlockColor(category).backgroundColor,
    []
  );

  const ICON = type?.toLocaleLowerCase().trim().replace(/\s/g, "");
  const OPACITY =
    !isBlockIsDev.includes(type) || draggedBlockType === type ? 0.5 : 1;

  const style = {
    maxWidth: "100%",
    opacity: OPACITY,
  };
  return (
    <Chip
      isDisabled={!isBlockIsDev.includes(type)}
      onMouseDown={_handleMouseDown}
      onMouseEnter={() => changeCursor("grab")}
      onMouseLeave={resetCursor}
      className="select-none h-10"
      startContent={
        draggedBlockType === type ? (
          <></>
        ) : (
          <IconUI name={ICON} width={20} height={20} />
        )
      }
      size="lg"
      radius="sm"
      color={BACKGROUND_COLOR}
      style={{ ...style }}
    >
      {draggedBlockType === type ? "" : type}
    </Chip>
  );
};
