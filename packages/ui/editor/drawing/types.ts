import { TPoint } from "schemas";

export type TCanvas = {
  size: { width: number; height: number };
};
export type TBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};
export type TDrawing = "freehand" | "polygon" | "Arrow";
export enum EDrawing {
  Freehand = "Freehand",
  Polygon = "Polygon",
  Arrow = "Arrow",
}

export type TShare = {
  stroke: string;
  fill?: string;
  strokeWidth?: number;
  cursor?: string;
  color?:string 
} & TShape;

export type TPath = {
  d: string;
} & TShare;
export type TShape = { shape?: string; id: string } & TPoint;
export type TFreeHand = {
  shape: string;
  path: string;
 
} & TShare;

export type TCircle = {
  x: number;
  y: number;
  r?: number;
  onDoubleClick: (id: string) => void;
} & TShare;

export type TPolygon = {
 
  points?: TShape[];
  fill?:string;
  canva: SVGSVGElement | null;
  onMouseDown: (
    event:
      | React.MouseEvent<
          HTMLDivElement | SVGSVGElement | SVGCircleElement,
          MouseEvent
        >
      | React.TouchEvent<HTMLDivElement | SVGSVGElement | SVGCircleElement>
  ) => void;
  onSelect: (points: TShape[],id:string) => void;
  positionInShape: any;
} & TShare;

export type TTooltip = {
  bounds: TBounds;
  defaultValue:string
  onChange?: (value:string) => void;
};

export type TPalette = {
  setActiveColor: (color: string) => void;
  closeColor: () => void;
  activeColor: string;
};
export type TBrush = {
  setActiveBrush: (brush: number) => void;
  closeBrush: () => void;
  activeBrush: number;
  activeColor: string;
};
export type TToolbar = {
  getActiveTool: (tool: string) => void;
  getActiveColor: (color: string) => void;
  getActiveBrush: (brush: number) => void;
  clean: () => void;
  defaultColor: string;
  defaultBrush: number;
};
