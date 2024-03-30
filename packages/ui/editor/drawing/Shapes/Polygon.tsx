import React, {  useEffect, useRef, useState } from "react";

import { serializeCoordinates } from "../../utils";
import { TPolygon,TShape } from "../types";

const Polygon = (props: TPolygon) => {
  const {
    points = [],
    fill = "green",
    id,
    onMouseDown,
    onSelect,
    positionInShape,
  } = props;

  const groupRef = useRef<SVGGElement|null>(null);
  const [collectionPoints, setPoints] = useState<TShape[]>(points);

  const _removePolygon = () => {
    setPoints([]);
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
        opacity={0.5}
        cursor="pointer"
        is-polygon="true"
        onMouseDown={() => onSelect(collectionPoints,id)}
        onDoubleClick={_removePolygon}
        id={id}
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
