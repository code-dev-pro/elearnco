"use client";
import useLocalStorage from "customhooks/use-local-storage";
import { changeCursor, getBlockColor, resetCursor } from "lib/utils";
import React, { useCallback, useRef } from "react";
import { CompleteBlock, DATA_MENU_BLOCK, EActionsBloc, TPoint } from "schemas";
import { usePageStore } from "store";

import { GoupeButtonUI } from "../button/groupeButton/GroupeButtonUI";
import { DEBUG, ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";
import { useDragDistance } from "../providers/WorkspaceDndProvider";
import BlockNodeModule from "./BlockNodeModule";

interface IProps {
  onMouseDown?: (blockNodePosition: any, block: Partial<CompleteBlock>) => void;
  block: Partial<CompleteBlock>;
  showSortPlaceholders: boolean;
  totalBlocks: number;
}
export const BlockNodeUI = (props: IProps) => {
  const {
    onMouseDown,
    block,
    showSortPlaceholders = false,
    totalBlocks = 0,
  } = props;
  const { removeBlock, duplicateBlock, moveDown, moveUp, activeBlock } =
    usePageStore();
  const [isOpen, setOpen] = useLocalStorage<string>(
    `state_${block.uuid}`,
    "open"
  );
  // const [isOpen, setOpen] = useState<boolean>(true);
  const blockRef = useRef<HTMLDivElement | null>(null);

  const onDrag = (position: { absolute: TPoint; relative: TPoint }): void => {
    if (block.type === "start" || !onMouseDown) return;
    onMouseDown?.(position, block);
  };

  const _onClickHandler = useCallback(
    (action: string, id: string, uuid: string) => {
      if (action === (EActionsBloc.DELETE as string)) {
        removeBlock(uuid);
      } else if (action === (EActionsBloc.DUPLICATE as string)) {
        duplicateBlock(uuid);
      } else if (action === (EActionsBloc.MOVEDOWN as string)) {
        moveDown(uuid);
      } else if (action === (EActionsBloc.MOVEUP as string)) {
        moveUp(uuid);
      } else if (action === (EActionsBloc.CLOSE as string)) {
        setOpen("close");
      } else if (action === (EActionsBloc.OPEN as string)) {
        setOpen("open");
      }
    },
    []
  );
  const newDataMenuBlock = [...DATA_MENU_BLOCK];
  if (block.index === 0) {
    newDataMenuBlock[0] = { ...newDataMenuBlock[0], isdisabled: "true" };
  }

  if (block.index === totalBlocks - 1) {
    newDataMenuBlock[1] = {
      ...newDataMenuBlock[1],
      isdisabled: "true",
    };
  }

  const BACKGROUND_COLOR = getBlockColor(block.type as string).color;
  const ICON = block.type?.toLocaleLowerCase().trim().replace(/\s/g, "");
  useDragDistance({
    ref: blockRef,
    onDrag,
    isDisabled: !onMouseDown,
  });

  return (
    <div
      className="flex items-start h-auto"
      style={{
        backgroundColor: BACKGROUND_COLOR,
        borderTop: `${
          activeBlock === block.uuid && !showSortPlaceholders
            ? `1px solid ${BACKGROUND_COLOR}`
            : "none"
        } `,
        borderBottom: `${
          activeBlock === block.uuid && !showSortPlaceholders
            ? `1px solid ${BACKGROUND_COLOR}`
            : "none"
        } `,
        transition: "border 250ms cubic-bezier(0.1, 0.2, 0.3, 0.4)",
        marginBottom: "1px",
      }}
    >
      <div
        ref={blockRef}
        onMouseEnter={(): void => changeCursor("grab")}
        onMouseLeave={resetCursor}
      >
        <IconUI
          color="black"
          name="drag"
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </div>
      <div className="flex flex-col p-2 bg-default-50 w-full h-full">
        <GoupeButtonUI
          isDisabled={showSortPlaceholders}
          data={[
            ...newDataMenuBlock,
            isOpen === "open"
              ? {
                  id: "7da740c0-8873-11ff-b962-0242ac1400802",
                  label: EActionsBloc.CLOSE,
                  shortcut: {
                    name: "",
                    action: EActionsBloc.CLOSE,
                  },
                  description: "",
                  icon: "expanddown",
                  hastooltip: true,
                  isdisabled: "false",
                  isvisible: "true",
                }
              : {
                  id: "7da740c0-8873-11ff-b962-0242ac1400802",
                  label: EActionsBloc.OPEN,
                  shortcut: {
                    name: "",
                    action: EActionsBloc.OPEN,
                  },
                  description: "",
                  icon: "expandtop",
                  hastooltip: true,
                  isdisabled: "false",
                  isvisible: "true",
                },
          ]}
          orientation="horizontal"
          onClickHandler={_onClickHandler}
          blockUUID={block.uuid}
          blockID={block.id}
          placementTooltip="top"
        />
        {DEBUG ? (
          <span>
            {block.index} - {block.type} - {block.uuid}
          </span>
        ) : (
          <div
            style={{ userSelect: showSortPlaceholders ? "none" : "auto" }}
            className="relative px-5"
          >
            {isOpen === "open" ? (
              <BlockNodeModule
                type={block.type as string}
                ino={block.uuid as string}
              />
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      <div className="w-6 h-6 flex justify-center mt-2">
        <IconUI
          color="white"
          name={ICON ?? ""}
          width={ICON_SIZE.width}
          height={ICON_SIZE.height}
        />
      </div>
    </div>
  );
};
