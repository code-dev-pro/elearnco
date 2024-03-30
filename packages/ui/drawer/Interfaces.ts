export interface IPlaceConfig {
  [key: string]: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    height: string | number;
    width: string | number;
  };
}
export interface IPlacementToggleConfig {
  [key: string]: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width: string | number;
    height: string | number;
  };
}
export interface IPlacementConfig {
  [key: string]: number;
}

export interface IDimensionConfig {
  width?: number;
  height?: number;
}

type TPosition = "fixed" | "absolute";

export interface IProps {
  position: TPosition;
  width: number;
  placeIn: string;
  classnames: string;
  hasOverlay: boolean;
  actionHandler: (state: boolean) => void;
  initialOpen?: boolean;
}
