import React, { useEffect, useRef, useState } from "react";

import { serializeCoordinates } from "../../utils";
import { TPolygon, TShape } from "../types";

const Polygon = (props: TPolygon) => {
  const {
    points = [],
    fill = "green",
    id,
    onMouseDown,
    onSelect,
    positionInShape,
    canDelete = false,
    deleteDraw,
  } = props;

  const groupRef = useRef<SVGGElement | null>(null);
  const [isOver, setIsOver] = useState<boolean>(false);
  const [collectionPoints, setPoints] = useState<TShape[]>(points);

  const _removePolygon = (): void => {
    if (!canDelete) setPoints([]);
  };

  useEffect(() => {
    if (positionInShape?.id) {
      const pointExists = collectionPoints.some(
        (point) => point.id === positionInShape.id
      );

      if (pointExists) {
        const updatedPoints = collectionPoints.map((point) => {
          if (point.id === positionInShape.id) {
            return { ...point, x: positionInShape.x, y: positionInShape.y };
          } else {
            return point;
          }
        });

        setPoints(updatedPoints);
      }
    }
  }, [positionInShape]);

  return (
    <g ref={groupRef}>
      <polygon
        points={serializeCoordinates(collectionPoints)}
        fill={fill}
        stroke={fill}
        cursor="pointer"
        is-polygon="true"
        onDoubleClick={_removePolygon}
        id={id}
        onClick={(): void =>
          canDelete ? deleteDraw?.(id) : onSelect(collectionPoints, id)
        }
        onMouseEnter={() => canDelete && setIsOver(true)}
        onMouseLeave={() => canDelete && setIsOver(false)}
        opacity={isOver && canDelete ? 0.5 : 1}
      />

      {collectionPoints.map((shape) => {
        return (
          <circle
            key={shape.id}
            id={shape.id}
            onMouseDown={onMouseDown}
            cx={shape.x}
            cy={shape.y}
            r="5"
            fill={fill}
            stroke={fill}
            is-handle-polygon="true"
            style={{ cursor: "pointer" }}
          />
        );
      })}
    </g>
  );
};

export default Polygon;
