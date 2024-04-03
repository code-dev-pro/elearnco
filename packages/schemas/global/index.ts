import { CompleteCourse, CompleteDrawing, TextBlockType } from "..";

export type TPoint = { x: number; y: number };
export type PointerType = 'mouse' | 'touch' | 'pen'
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

export const OColor = {
  default: "default",
  primary: "#006FEE",
  secondary: "#7828c8",
  success: "#17c964",
  warning: "#f5a524",
  danger: "#f5a524",
} as const;

export type TColor = keyof typeof EColor;
export type TPosition = "relative" | "fixed";
export type TModeEditor = "authoring" | "adaptive"
export enum EModeEditor {
  authoring = "authoring",
  adaptive = "adaptive",

}

export type TContent = {
  id: string;
  title?: string;
  description?: string;
  copyright?: string;
  content?: GenericObject;
  instruction: string;
  markers?: { content: string; type: string }[];
};
export type TModuleContent = CompleteCourse & (TContent | undefined) &{ Drawing:[]};

export type TModuleWriter = {
  content: string;
  type: TextBlockType;
};
export type TModuleWheel = {
  content: {
    data: { id: string; time: number; index: number; title: string }[];
  };
  color: string;
  instruction: string;
  type: string;
};
export type TModuleQuiz = {
  content: {
    data: {
      id: string;
      isGood: boolean;
      content: string;
      editable: boolean;
    }[];
  };
  color: string;
  isRandom: boolean;
  type: string;
  instruction: string;
};
export type TModuleImage = {
  content: string;
  title: string;
  copyright: string;
  instruction?: string;
  type?: string;
  markers?: { x: number; time: number; id: string; label: string }[];
  onChange?:(m:GenericObject)=>void
  isReadonly?:boolean
  description?:string
  drawing: CompleteDrawing[] | []
  blockNodeId:string

};
export type TModuleVideo = {
  content: string;
  markers: { x: number; time: number; id: string; label: string }[];
  title: string;
  copyright: string;
  description: string;
  instruction: string;
  id: string;
  type: string;
  isReadonly?:boolean
  onChange?:(m:GenericObject)=>void
};
export type TModuleAudio = {
  content: string;
  markers: { x: number; time: number; id: string; label: string }[];
  title: string;
  copyright: string;
  description: string;
  instruction: string;
  id: string;
  type: string;
  isReadonly?:boolean
  onChange?:(m:GenericObject)=>void
};
export type TPropModule =
  | TModuleWriter
  | TModuleAudio
  | TModuleVideo
  | TModuleImage
  | TModuleQuiz
  | TModuleWheel;


  export type Providers = "youtube" | "vimeo" | "html5";
  export type TTrackers = {
  x: number;
  time: number;
  id: string;
  label: string;
};