"use client";
import { useEventListener } from "customhooks";
import { changeCursor, resetCursor } from "lib";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CompleteBlock, DraggableBlockType, IdMap, TPoint } from "schemas";
export type GroupsCoordinates = IdMap<TPoint>;
type NodeElement = {
  id: string;
  element: HTMLDivElement;
};

const workspaceDndContext = createContext<{
  draggedBlockType?: DraggableBlockType;
  setDraggedBlockType: Dispatch<SetStateAction<DraggableBlockType | undefined>>;
  draggedBlock?: Partial<CompleteBlock>;
  setDraggedBlock: Dispatch<SetStateAction<Partial<CompleteBlock> | undefined>>;
  mouseOverGroup?: NodeElement;
  setMouseOverGroup: (node: NodeElement | undefined) => void;
  mouseOverBlock?: NodeElement;
  setMouseOverBlock: (node: NodeElement | undefined) => void;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
}>({});

export type NodePosition = { absolute: TPoint; relative: TPoint };

export const WorkspaceDndProvider = ({ children }: { children: ReactNode }) => {
  const [draggedBlock, setDraggedBlock] = useState<Partial<CompleteBlock>>();
  const [draggedBlockType, setDraggedBlockType] = useState<
    DraggableBlockType | undefined
  >();
  const [mouseOverGroup, _setMouseOverGroup] = useState<NodeElement>();
  const [mouseOverBlock, _setMouseOverBlock] = useState<NodeElement>();

  const setMouseOverGroup = useCallback(
    (node: NodeElement | undefined) => {
      if (node && !draggedBlock && !draggedBlockType) return;

      _setMouseOverGroup(node);
    },
    [draggedBlock, draggedBlockType]
  );

  const setMouseOverBlock = useCallback((node: NodeElement | undefined) => {
    if (node) return;
    _setMouseOverBlock(node);
  }, []);

  return (
    <workspaceDndContext.Provider
      value={{
        draggedBlock,
        setDraggedBlock,
        draggedBlockType,
        setDraggedBlockType,
        mouseOverGroup,
        setMouseOverGroup,
        mouseOverBlock,
        setMouseOverBlock,
      }}
    >
      {children}
    </workspaceDndContext.Provider>
  );
};

export const useDragDistance = ({
  ref,
  onDrag,
  distanceTolerance = 20,
  isDisabled = false,
}: {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  onDrag: (position: { absolute: TPoint; relative: TPoint }) => void;
  distanceTolerance?: number;
  isDisabled: boolean;
}) => {
  const mouseDownPosition = useRef<{
    absolute: TPoint;
    relative: TPoint;
  }>();

  const handleMouseUp = (): void => {
    resetCursor();
    if (mouseDownPosition) mouseDownPosition.current = undefined;
  };
  useEventListener("mouseup", handleMouseUp);

  const handleMouseDown = (e: MouseEvent): void => {
    changeCursor("grabbing");
    if (isDisabled || !ref.current) return;
    e.stopPropagation();
    const { top, left } = ref.current.getBoundingClientRect();
    mouseDownPosition.current = {
      absolute: { x: e.clientX, y: e.clientY },
      relative: {
        x: e.clientX - left,
        y: e.clientY - top,
      },
    };
  };
  useEventListener("mousedown", handleMouseDown, ref);

  useEffect(() => {
    let triggered = false;

    const triggerDragCallbackIfMouseMovedEnough = (e: MouseEvent): void => {
      if (!mouseDownPosition.current || triggered) return;
      changeCursor("grabbing");
      const { clientX, clientY } = e;
      if (
        Math.abs(mouseDownPosition.current.absolute.x - clientX) >
          distanceTolerance ||
        Math.abs(mouseDownPosition.current.absolute.y - clientY) >
          distanceTolerance
      ) {
        triggered = true;

        onDrag(mouseDownPosition.current);
      }
    };

    document.addEventListener(
      "mousemove",
      triggerDragCallbackIfMouseMovedEnough
    );

    return () => {
      document.removeEventListener(
        "mousemove",
        triggerDragCallbackIfMouseMovedEnough
      );
    };
  }, [distanceTolerance, onDrag]);
};

export const useBlockDnd = () => useContext(workspaceDndContext);
