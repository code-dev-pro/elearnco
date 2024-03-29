"use client";
import { useEventListener } from "customhooks";
import {
  changeCursor,
  computeNearestPlaceholderIndex,
  getBlockColor,
} from "lib/utils";
import React, { useMemo, useRef, useState } from "react";
import { CompleteBlock, TPoint } from "schemas";
import { usePageStore } from "store";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";
import { useBlockDnd } from "../providers/WorkspaceDndProvider";
import { BlockNodeUI } from "./BlockNodeUI";
import { DRAG_BLOCK_STYLE, WRAPPER_STYLE } from "./const";
import { PlaceholderNodeUI } from "./PlaceholderNodeUI";
// import { useCollaboration, useYMapItem } from "collaboration";
// import { actionAddBlock, mockBlockData } from "store/editor/page/actions";

// const ParentComponent = () => {

//   const { doc } = useCollaboration();
//    const { blocks: localBlocks } = usePageStore();
//   const [blocks=localBlocks, setBlocks] = useYMapItem<any[]>(doc?.getMap("blocks"), "blocks");
//   return <BlockNodesListUI bloc={blocks} setBlocks={setBlocks}  />;
// };

const BlockNodesListUI = () => {
  // Hooks & States, blocks
  //const isCollaboration = useIsCollaboration("collaboration");
  //const { doc } = useCollaboration();
  const { addBlock, reorderBlock, blocks } = usePageStore();
  // const [blocks=[], setBlocks] = useYMapItem<any[]>(doc?.getMap("blocks"), "blocks");

  const [mousePositionInElement, setMousePositionInElement] = useState({
    x: 0,
    y: 0,
  });
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const {
    draggedBlock,
    setDraggedBlock,
    draggedBlockType,
    setDraggedBlockType,
  } = useBlockDnd();

  const [expandedPlaceholderIndex, setExpandedPlaceholderIndex] = useState<
    number | undefined
  >();
  // Refs
  const placeholderRefs = useRef<HTMLDivElement[]>([]);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const showSortPlaceholders = !!(draggedBlockType ?? draggedBlock);
  const isDraggingOnCurrentGroup = draggedBlock ?? draggedBlockType;

  const handlePushElementRef =
    (idx: number) =>
    (elem: HTMLDivElement | null): void => {
      elem && (placeholderRefs.current[idx] = elem);
    };

  // Methods
  const handleMouseMoveGlobal = (event: MouseEvent): void => {
    if (!draggedBlock) return;

    const { clientX, clientY } = event;
    setPosition({
      x: clientX - mousePositionInElement.x,
      y: clientY - mousePositionInElement.y,
    });
  };

  const handleBlockMouseDown =
    (blockIndex: number) =>
    (
      { relative, absolute }: { absolute: TPoint; relative: TPoint },
      block: Partial<CompleteBlock>
    ) => {
      placeholderRefs.current.splice(blockIndex + 1, 1);
      setMousePositionInElement(relative);
      setPosition({
        x: absolute.x - relative.x,
        y: absolute.y - relative.y,
      });

      setDraggedBlock(block);
    };

  const handleMouseMoveOnGroup = (event: MouseEvent): void => {
    const index = computeNearestPlaceholderIndex(event.pageY, placeholderRefs);

    setExpandedPlaceholderIndex(index);
  };
  const handleMouseUpOnGroup = (event: MouseEvent): void => {
    setExpandedPlaceholderIndex(undefined);
    if (!isDraggingOnCurrentGroup) return;
    const blockIndex = computeNearestPlaceholderIndex(
      event.clientY,
      placeholderRefs
    );

    //Reorder group
    if (draggedBlock?.index != undefined) {
      const _index =
        draggedBlock.index > blockIndex ? blockIndex : blockIndex - 1;

      reorderBlock(_index, draggedBlock);
    }

    //Add in group
    if (draggedBlockType && !draggedBlock) {
      addBlock?.(blockIndex, draggedBlockType);
      // if(isCollaboration){
      //   const { BLOCK_DATA } = mockBlockData(blockIndex, draggedBlockType, page.id);
      //    const te= actionAddBlock(blocks,BLOCK_DATA,blockIndex)
      //    setBlocks(te)

      // } else {

      // }
    }

    setDraggedBlock(undefined);
    setDraggedBlockType(undefined);
  };

  useEventListener("mousemove", handleMouseMoveGlobal);
  useEventListener("mouseup", () => {
    setDraggedBlock(undefined);
    setDraggedBlockType(undefined);
  });
  useEventListener("mousemove", handleMouseMoveOnGroup, groupRef);
  useEventListener("mouseup", handleMouseUpOnGroup, groupRef, {
    capture: true,
  });
  useEventListener(
    "mouseleave",
    () => {
      setExpandedPlaceholderIndex(undefined);
    },
    groupRef
  );

  const totalBlocks = useMemo(() => blocks?.length, [blocks]);

  if (draggedBlock) {
    changeCursor("grabbing");
  }

  return (
    <>
      <div className="w-full" ref={groupRef} style={WRAPPER_STYLE}>
        {blocks?.length === 0 ? (
          <PlaceholderNodeUI
            index={0}
            type={
              (draggedBlockType as string) || (draggedBlock?.type as string)
            }
            isVisible
            isExpanded
            onRef={handlePushElementRef(0 as number)}
            IsInit
          />
        ) : (
          blocks?.map((block: Partial<CompleteBlock>, index: number) => {
            return (
              <div
                id={block.uuid}
                key={block.uuid}
                style={{
                  pointerEvents: draggedBlock ? "none" : "auto",
                  userSelect: draggedBlock ? "none" : "auto",
                }}
              >
                {index === 0 ? (
                  <PlaceholderNodeUI
                    index={index}
                    type={
                      (draggedBlockType as string) ||
                      (draggedBlock?.type as string)
                    }
                    isVisible={showSortPlaceholders}
                    isExpanded={
                      (expandedPlaceholderIndex === block.index &&
                        (draggedBlockType || draggedBlock)) as boolean
                    }
                    onRef={handlePushElementRef(block.index as number)}
                  />
                ) : (
                  <></>
                )}
                {draggedBlock && draggedBlock.uuid === block.uuid ? (
                  <></>
                ) : (
                  <BlockNodeUI
                    block={block}
                    onMouseDown={handleBlockMouseDown(block.index as number)}
                    showSortPlaceholders={showSortPlaceholders}
                    totalBlocks={totalBlocks}
                  />
                )}
                <PlaceholderNodeUI
                  index={index + 1}
                  type={
                    (draggedBlockType as string) ||
                    (draggedBlock?.type as string)
                  }
                  isVisible={showSortPlaceholders}
                  isExpanded={
                    (expandedPlaceholderIndex === Number(block.index) + 1 &&
                      (draggedBlockType || draggedBlock)) as boolean
                  }
                  onRef={handlePushElementRef(Number(block.index) + 1)}
                />
              </div>
            );
          })
        )}
      </div>
      {draggedBlock && (
        <div
          className="flex items-start fixed w-full top-0 left-0"
          style={{
            ...DRAG_BLOCK_STYLE,
            transform: `translate(${position.x}px, ${position.y}px) rotate(-2deg) scale(1)`,
          }}
        >
          <div
            style={{
              backgroundColor: getBlockColor(draggedBlock.type as string).color,
            }}
          >
            <IconUI
              name="drag"
              width={ICON_SIZE.width}
              height={ICON_SIZE.height}
            />
          </div>
          <div
            className="flex p-5"
            style={{
              width: "100%",
              height: "100%",
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
              borderBottomLeftRadius: "5px",
              backgroundColor: getBlockColor(draggedBlock.type as string).color,
            }}
          >
            {draggedBlock
              ? `You drag your ${draggedBlock.type?.toUpperCase()}`
              : ""}
          </div>
        </div>
      )}
    </>
  );
};

export default BlockNodesListUI;
