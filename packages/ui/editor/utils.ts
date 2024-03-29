import { BRUSH } from "./drawing/const";
import { TBounds, TShape } from "./drawing/types";

export const getAveragePoint = (
  offset: number,
  lastMousePoints: number[][]
): { x: number; y: number } | null => {
  const len = lastMousePoints.length;
  if (len % 2 === 1 || len >= 8) {
    let totalX = 0;
    let totalY = 0;
    let pt, i;
    let count = 0;
    for (i = offset; i < len; i++) {
      count++;
      pt = lastMousePoints[i];
      totalX += pt[0];
      totalY += pt[1];
    }

    return {
      x: totalX / count,
      y: totalY / count,
    };
  }
  return null;
};

export function getBrushName(stroke: number): string {
  for (const [key, value] of Object.entries(BRUSH)) {
    if (value.stroke === stroke) {
      return value.name;
    }
  }
  return "";
}

export const  calculateBounds=(polygon: TShape[]): TBounds=> {
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;

  polygon.forEach((point) => {
    minX = Math.min(minX, point.x) || 0;
    minY = Math.min(minY, point.y) || 0;
    maxX = Math.max(maxX, point.x) || 0;
    maxY = Math.max(maxY, point.y) || 0;
  });

  return { minX, minY, maxX, maxY };
}

export function serializeCoordinates(points: TShape[]) {
  return points.map((point: TShape) => `${point.x},${point.y}`).join(",");
}
