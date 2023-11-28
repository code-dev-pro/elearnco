export type TPoint = { x: number; y: number };
export const POINT = { x: 0, y: 0 };
export type IdMap<T> = { [id: string]: T };
export interface GenericObject {
  [key: string]: any;
}
export type TFixedInPosition = "top" | "bottom" | "left" | "right";
export enum EColor {
  default = "default",
  primary = "primary",
  secondary = "secondary",
  success = "success",
  warning = "warning",
  danger = "danger",
}

export const OColor =  {
  default : "default",
  primary : "#006FEE",
  secondary : "#7828c8",
  success : "#17c964",
  warning : "#f5a524",
  danger : "#f5a524",
} as const

export type TColor = keyof typeof EColor;
export type TPosition = "relative" | "fixed";
