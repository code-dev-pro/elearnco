import { TPoint } from "schemas";
import { roundCorners } from "svg-round-corners";

export const stubLength = 20;
export const groupWidth = 300;

export const computeThreeSegments = (
  sourcePosition: TPoint,
  targetPosition: TPoint,
  sourceType: "right" | "left"
) => {
  const segments: String[] = [];
  const firstSegmentX =
    sourceType === "right"
      ? sourcePosition.x + (targetPosition.x - sourcePosition.x) / 2
      : sourcePosition.x - (sourcePosition.x - targetPosition.x) / 2;
  segments.push(`L${firstSegmentX},${sourcePosition.y}`);
  segments.push(`L${firstSegmentX},${targetPosition.y}`);
  segments.push(`L${targetPosition.x},${targetPosition.y}`);
  return segments.join(" ");
};
export const computeEdgePathToMouse = ({
  sourceGroupCoordinates,
  mousePosition,
  sourceTop,
  elementWidth,
}: {
  sourceGroupCoordinates: TPoint;
  mousePosition: TPoint;
  sourceTop: number;
  elementWidth: number;
}): string => {
  const sourcePosition = {
    x:
      mousePosition.x - sourceGroupCoordinates.x > elementWidth / 2
        ? sourceGroupCoordinates.x + elementWidth
        : sourceGroupCoordinates.x,
    y: sourceTop,
  };
  const sourceType =
    mousePosition.x - sourceGroupCoordinates.x > elementWidth / 2
      ? "right"
      : "left";
  const segments = computeThreeSegments(
    sourcePosition,
    mousePosition,
    sourceType
  );
  return roundCorners(
    `M${sourcePosition.x},${sourcePosition.y} ${segments}`,
    pathRadius
  ).path;
};
export const groupAnchorsOffset = {
  left: {
    x: 0,
    y: stubLength,
  },
  top: {
    x: groupWidth / 2,
    y: 0,
  },
  right: {
    x: groupWidth,
    y: stubLength,
  },
};
export const eventWidth = 200;

export const graphPositionDefaultValue = (firstGroupCoordinates: TPoint) => ({
  x: 400 - firstGroupCoordinates.x,
  y: 100 - firstGroupCoordinates.y,
  scale: 1,
});

export const pathRadius = 20;
const parseGroupAnchorPosition = (
  blockPosition: TPoint,
  anchor: "left" | "top" | "right",
  targetOffsetY?: number
): TPoint => {
  switch (anchor) {
    case "left":
      return {
        x: blockPosition.x + groupAnchorsOffset.left.x,
        y: targetOffsetY ?? blockPosition.y + groupAnchorsOffset.left.y,
      };
    case "top":
      return {
        x: blockPosition.x + groupAnchorsOffset.top.x,
        y: blockPosition.y + groupAnchorsOffset.top.y,
      };
    case "right":
      return {
        x: blockPosition.x + groupAnchorsOffset.right.x,
        y: targetOffsetY ?? blockPosition.y + groupAnchorsOffset.right.y,
      };
  }
};
const computeGroupTargetPosition = ({
  sourceGroupPosition,
  targetGroupPosition,
  elementWidth,
  sourceOffsetY,
  targetOffsetY,
}: {
  sourceGroupPosition: TPoint;
  targetGroupPosition: TPoint;
  elementWidth: number;
  sourceOffsetY: number;
  targetOffsetY?: number;
}): { targetPosition: TPoint; totalSegments: number } => {
  const isTargetGroupBelow =
    targetGroupPosition.y > sourceOffsetY &&
    targetGroupPosition.x < sourceGroupPosition.x + elementWidth + stubLength &&
    targetGroupPosition.x > sourceGroupPosition.x - elementWidth - stubLength;
  const isTargetGroupToTheRight = targetGroupPosition.x < sourceGroupPosition.x;
  const isTargettingGroup = !targetOffsetY;

  if (isTargetGroupBelow && isTargettingGroup) {
    const isExterior =
      targetGroupPosition.x <
        sourceGroupPosition.x - elementWidth / 2 - stubLength ||
      targetGroupPosition.x >
        sourceGroupPosition.x + elementWidth / 2 + stubLength;
    const targetPosition = parseGroupAnchorPosition(targetGroupPosition, "top");
    return { totalSegments: isExterior ? 2 : 4, targetPosition };
  } else {
    const isExterior =
      targetGroupPosition.x < sourceGroupPosition.x - elementWidth ||
      targetGroupPosition.x > sourceGroupPosition.x + elementWidth;
    const targetPosition = parseGroupAnchorPosition(
      targetGroupPosition,
      isTargetGroupToTheRight ? "right" : "left",
      targetOffsetY
    );
    return { totalSegments: isExterior ? 3 : 5, targetPosition };
  }
};

export const computeSourceCoordinates = ({
  sourcePosition,
  sourceTop,
  elementWidth,
}) => ({
  x: sourcePosition.x + elementWidth,
  y: sourceTop,
});
export const getAnchorsPosition = ({
  sourceGroupCoordinates,
  targetGroupCoordinates,
  elementWidth,
  sourceTop,
  targetTop,
  graphScale,
}: {
  sourceGroupCoordinates: TPoint;
  targetGroupCoordinates: TPoint;
  elementWidth: number;
  sourceTop: number;
  targetTop: number;
  graphScale: number;
}): {
  sourcePosition: TPoint;
  targetPosition: TPoint;
  sourceType: "right" | "left";
  totalSegments: number;
} => {
  const sourcePosition = computeSourceCoordinates({
    sourcePosition: sourceGroupCoordinates,
    elementWidth,
    sourceTop,
  });
  let sourceType: "right" | "left" = "right";
  if (sourceGroupCoordinates.x > targetGroupCoordinates.x) {
    sourcePosition.x = sourceGroupCoordinates.x;
    sourceType = "left";
  }

  const { targetPosition, totalSegments } = computeGroupTargetPosition({
    sourceGroupPosition: sourceGroupCoordinates,
    targetGroupPosition: targetGroupCoordinates,
    elementWidth,
    sourceOffsetY: sourceTop,
    targetOffsetY: targetTop,
  });
  return { sourcePosition, targetPosition, sourceType, totalSegments };
};
export const computeTwoSegments = (
  sourcePosition: TPoint,
  targetPosition: TPoint
) => {
  const segments: String[] = [];
  segments.push(`L${targetPosition.x},${sourcePosition.y}`);
  segments.push(`L${targetPosition.x},${targetPosition.y}`);
  return segments.join(" ");
};
export const computeFourSegments = (
  sourcePosition: TPoint,
  targetPosition: TPoint,
  sourceType: "right" | "left"
) => {
  const segments: String[] = [];
  const firstSegmentX =
    sourcePosition.x + (sourceType === "right" ? stubLength : -stubLength);
  segments.push(`L${firstSegmentX},${sourcePosition.y}`);
  const secondSegmentY =
    sourcePosition.y + (targetPosition.y - sourcePosition.y) - stubLength;
  segments.push(`L${firstSegmentX},${secondSegmentY}`);

  segments.push(`L${targetPosition.x},${secondSegmentY}`);

  segments.push(`L${targetPosition.x},${targetPosition.y}`);
  return segments.join(" ");
};
export const computeFiveSegments = (
  sourcePosition: TPoint,
  targetPosition: TPoint,
  sourceType: "right" | "left"
) => {
  const segments: String[] = [];
  const firstSegmentX =
    sourcePosition.x + (sourceType === "right" ? stubLength : -stubLength);
  segments.push(`L${firstSegmentX},${sourcePosition.y}`);
  const firstSegmentY =
    sourcePosition.y + (targetPosition.y - sourcePosition.y) / 2;
  segments.push(
    `L${
      sourcePosition.x + (sourceType === "right" ? stubLength : -stubLength)
    },${firstSegmentY}`
  );

  const secondSegmentX =
    targetPosition.x - (sourceType === "right" ? stubLength : -stubLength);
  segments.push(`L${secondSegmentX},${firstSegmentY}`);

  segments.push(`L${secondSegmentX},${targetPosition.y}`);

  segments.push(`L${targetPosition.x},${targetPosition.y}`);
  return segments.join(" ");
};
export const getSegments = ({
  sourcePosition,
  targetPosition,
  sourceType,
  totalSegments,
}: {
  sourcePosition: TPoint;
  targetPosition: TPoint;
  sourceType: "right" | "left";
  totalSegments: number;
}): string => {
  switch (totalSegments) {
    case 2:
      return computeTwoSegments(sourcePosition, targetPosition);
    case 3:
      return computeThreeSegments(sourcePosition, targetPosition, sourceType);
    case 4:
      return computeFourSegments(sourcePosition, targetPosition, sourceType);
    default:
      return computeFiveSegments(sourcePosition, targetPosition, sourceType);
  }
};
export const computeEdgePath = ({
  sourcePosition,
  targetPosition,
  sourceType,
  totalSegments,
}: {
  sourcePosition: TPoint;
  targetPosition: TPoint;
  sourceType: "right" | "left";
  totalSegments: number;
}): string => {
  const segments = getSegments({
    sourcePosition,
    targetPosition,
    sourceType,
    totalSegments,
  });
  return roundCorners(
    `M${sourcePosition.x},${sourcePosition.y} ${segments}`,
    pathRadius
  ).path;
};
export const computeConnectingEdgePath = ({
  sourceGroupCoordinates,
  targetGroupCoordinates,
  elementWidth,
  sourceTop,
  targetTop,
  graphScale,
}: {
  sourceGroupCoordinates: TPoint;
  targetGroupCoordinates: TPoint;
  elementWidth: number;
  sourceTop: number;
  targetTop: number;
  graphScale: number;
}) => {
  const anchorsPosition = getAnchorsPosition({
    sourceGroupCoordinates,
    targetGroupCoordinates,
    elementWidth,
    sourceTop,
    targetTop,
    graphScale,
  });
  return computeEdgePath(anchorsPosition);
};
