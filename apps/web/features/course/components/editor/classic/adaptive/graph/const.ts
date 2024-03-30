import { TPoint } from "schemas";

export const GROUPWIDTH = 300;
export const PADDING = 80;

export const maxScale = 2;
export const minScale = 0.3;
export const zoomButtonsScaleBlock = 0.2;
export const graphPositionDefaultValue = (firstGroupCoordinates: TPoint) => ({
  x: 400 - firstGroupCoordinates.x,
  y: 100 - firstGroupCoordinates.y,
  scale: 1,
});

export const COLOR = "hsl(var(--nextui-primary) / var(--nextui-primary-opacity, var(--tw-bg-opacity)))";
