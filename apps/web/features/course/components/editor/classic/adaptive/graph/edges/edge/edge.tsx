import React, { useMemo, useState } from "react";
import { useEndpoints } from "../../provider/endpointsProvider";
import { useGraph } from "../../provider/editorGraphProvider";
import { COLOR } from "../../const";
import { computeEdgePath, getAnchorsPosition } from "../drawingEdge";
import { TEdge } from "..";
import { TPoint } from "schemas";



export const Edge = ({edge}:{edge:TEdge }) => {
  const { sourceEndpointYOffsets, targetEndpointYOffsets } = useEndpoints();
  const { graphPosition } = useGraph();



  const toGroupCoordinates = {
    x: targetEndpointYOffsets.get(edge?.to?.groupId as string)?.position?.x ?? 0,
    y: targetEndpointYOffsets.get(edge?.to?.groupId as string)?.position?.y ?? 0,
  };
  const sourceElementCoordinates = {
    x: sourceEndpointYOffsets.get(edge?.from?.groupId as string)?.position?.x ?? 0,
    y: sourceEndpointYOffsets.get(edge?.from?.groupId as string)?.position?.y ?? 0,
  };

  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [edgeMenuPosition, setEdgeMenuPosition] = useState({ x: 0, y: 0 });
  const isPreviewing = false;

  const path = useMemo((): string => {
    if (
      !sourceElementCoordinates.y ||
      !toGroupCoordinates.y ||
      !sourceElementCoordinates.x ||
      !toGroupCoordinates.x ||
      !edge?.from?.graphPosition ||
      !edge?.to?.graphPosition
    )
      return ``;

    const anchorsPosition = getAnchorsPosition({
      sourceGroupCoordinates: {
        x: sourceElementCoordinates.x,
        y: sourceElementCoordinates.y,
      },
      targetGroupCoordinates: {
        x: toGroupCoordinates.x,
        y: toGroupCoordinates.y,
      },
      elementWidth: 300,
      sourceTop: sourceElementCoordinates.y,
      targetTop: toGroupCoordinates.y,
      graphScale: graphPosition.scale,
    });
    return computeEdgePath(anchorsPosition);
  }, [
    sourceElementCoordinates,
    toGroupCoordinates,
    edge.from,
    graphPosition.scale,
  ]);

  const handleMouseEnter = (): void => setIsMouseOver(true);

  const handleMouseLeave = (): void => setIsMouseOver(false);

  const handleEdgeClick = (): void => {};

  const handleContextMenuTrigger = (e: React.MouseEvent): void => {
    e.preventDefault();
    setEdgeMenuPosition({ x: e.clientX, y: e.clientY });
  };

  if (path === "") return <></>;
  return (
    <>
      <path
        data-testid="clickable-edge"
        d={path}
        strokeWidth="18px"
        stroke="none"
        fill="none"
        pointerEvents="stroke"
        style={{ cursor: "pointer", visibility: "hidden" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // onMouseDown={(e)=> e.stopPropagation()}
        onClick={handleEdgeClick}
        onContextMenu={handleContextMenuTrigger}
      />
      <path
        data-testid="edge"
        d={path}
        stroke={COLOR}
        strokeWidth="2px"
        markerEnd={isPreviewing ? "url(#blue-arrow)" : "url(#arrow)"}
        fill="none"
        pointerEvents="none"
      />

      {/* <Portal>
        <EdgeMenu
          isOpen={isOpen}
          position={edgeMenuPosition}
          onDeleteEdge={handleDeleteEdge}
          onClose={onClose}
        />
      </Portal> */}
    </>
  );
};
