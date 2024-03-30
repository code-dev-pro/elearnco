import { useCallback, useRef, useState } from "react";
import { useCourseStore } from "store";
import { maxScale, minScale, zoomButtonsScaleBlock } from "./const";
import { LAYOUT } from "ui";
import { useGesture } from "@use-gesture/react";
import { useGroupsStore } from "./hooks/useGroupsStore";
import { TPoint } from "schemas";
import React from "react";
import { EndpointsProvider } from "./provider/endpointsProvider";
import { useGraph } from "./provider/editorGraphProvider";
import Blocks from "./blocks";
import Edges from "./edges";
import { ToolButtons } from "./toolButtons";
import { useCoursesParams } from "customhooks";

const EditorGraph = () => {
  // STATES ----------------------------------------------------------------
  const { pages, course } = useCourseStore();

  const { setGraphPosition, graphPosition, kindOfVue, setkindOfVue } =
    useGraph();
  const { getCurrentPage } = useCoursesParams();
  const currentPage = getCurrentPage();
  const blocks = kindOfVue === "block" ? pages[currentPage - 1].blocks : pages;
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isDraggingGraph = useGroupsStore((state) => state.isDraggingGraph);
  const isLockGraph = useGroupsStore((state) => state.isLockGraph);
  const setIsLockGraph = useGroupsStore((state) => state.setIsLockGraph);

  // REFS ----------------------------------------------------------------
  const graphContainerRef = useRef<HTMLDivElement | null>(null);

  // METHODS ----------------------------------------------------------------
  // # Get graph center point
  const _getCenterOfGraph = (): TPoint => {
    const graphWidth = graphContainerRef.current?.clientWidth ?? 0;
    const graphHeight = graphContainerRef.current?.clientHeight ?? 0;
    return {
      x: graphWidth / 2,
      y: graphHeight / 2,
    };
  };

  const _setGraphPosition = (val: TPoint & { scale: number }): void => {
    setGraphPosition(val);
  };
  // # Get graph center point
  const _zoom = ({
    scale,
    mousePosition,
    delta,
  }: {
    scale?: number;
    delta?: number;
    mousePosition?: TPoint;
  }): void => {
    const { x: mouseX, y } = mousePosition ?? _getCenterOfGraph();

    const mouseY = y - 80; //80 => header height

    let newScale = graphPosition.scale + (delta ?? 0);
    if (scale) {
      const scaleDiff = scale - graphPosition.scale;
      newScale +=
        Math.min(zoomButtonsScaleBlock, Math.abs(scaleDiff)) *
        Math.sign(scaleDiff);
    }

    if (
      (newScale >= maxScale && graphPosition.scale === maxScale) ||
      (newScale <= minScale && graphPosition.scale === minScale)
    )
      return;
    newScale =
      newScale >= maxScale
        ? maxScale
        : newScale <= minScale
        ? minScale
        : newScale;

    const xs = (mouseX - graphPosition.x) / graphPosition.scale;
    const ys = (mouseY - graphPosition.y) / graphPosition.scale;
    _setGraphPosition({
      ...graphPosition,
      x: mouseX - xs * newScale,
      y: mouseY - ys * newScale,
      scale: newScale,
    });
  };

  const _getCursor = useCallback(
    (): string => (isLockGraph ? "auto" : isDragging ? "grabbing" : "grab"),
    [isLockGraph, isDragging]
  );

  const _zoomIn = (): void => _zoom({ delta: zoomButtonsScaleBlock });
  const _zoomOut = (): void => _zoom({ delta: -zoomButtonsScaleBlock });
  const _lockGraph = (): void => setIsLockGraph(!isLockGraph);

  // GESTURE IN REF : graphContainerRef
  useGesture(
    {
      onDrag: (props): void => {
        if (isLockGraph) return;

        if (
          (props.target as HTMLElement)
            .closest(".prevent-group-drag")
            ?.classList.contains("prevent-group-drag")
        )
          return;
        props.event.stopPropagation();

        if (isDraggingGraph || !props.shiftKey) {
          if (props.first) {
            setIsDragging(true);
          }
          if (props.last) setIsDragging(false);
          _setGraphPosition({
            ...graphPosition,
            x: graphPosition.x + props.delta[0],
            y: graphPosition.y + props.delta[1],
          });
        }
      },
      onWheel: ({ shiftKey, delta: [dx, dy], pinching }): void => {
        if (pinching || isLockGraph) return;
        _setGraphPosition({
          ...graphPosition,
          x: shiftKey ? graphPosition.x - dy : graphPosition.x - dx,
          y: shiftKey ? graphPosition.y : graphPosition.y - dy,
        });
      },

      onPinch: ({ origin: [x, y], offset: [scale] }): void => {
        if (isLockGraph) return;
        _zoom({ scale, mousePosition: { x, y } });
      },
    },
    {
      target: graphContainerRef,
      pinch: {
        scaleBounds: { min: minScale, max: maxScale },
        modifierKey: "ctrlKey",
      },
      drag: { pointer: { keys: false } },
    }
  );
  const cursor = _getCursor();

  // Sides Effects

  return (
    <div
      ref={graphContainerRef}
      className="flex relative w-full h-full"
      style={{
        touchAction: "none",
        cursor,
      }}
    >
      <div
        style={{ top: `calc(${LAYOUT.HEADER.height} + 20px)` }}
        className="flex gap-2 fixed left-10 z-50 items-center"
      >
        <div className="text-xs white">
          {Math.round(graphPosition.scale * 100)}%
        </div>
        <ToolButtons
          isLockGraph={isLockGraph}
          onLockClick={_lockGraph}
          onZoomInClick={_zoomIn}
          onZoomOutClick={_zoomOut}
          kindOfVue={kindOfVue}
          setkindOfVue={setkindOfVue}
        />
      </div>
      <div
        className="flex w-full h-full absolute top-0 left-0"
        style={{
          transform: `translate(${graphPosition?.x}px, ${
            graphPosition?.y
          }px) scale(${graphPosition.scale ? graphPosition.scale : 1})`,
          perspective: 1000,
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transformOrigin: "0px 0px 0px",
        }}
      >
        <EndpointsProvider>
          {blocks.length > 0 && (
            <>
              <Edges blocks={blocks} />
              <Blocks
                banner={course.image}
                blocks={blocks}
                graphScale={graphPosition.scale}
              />
            </>
          )}
        </EndpointsProvider>
      </div>
    </div>
  );
};

export default EditorGraph;
