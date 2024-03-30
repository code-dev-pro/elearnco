
export const CONFIG = {
  isDrawing: false,
  tool: "polygon",
  color: "white",
  strokeWidth: 4,
  configNormalisation: 12,
};
export const TOOL_MODES = {
  DRAW: "draw",
  MOVE: "move",
  SELECT: "select",
  ERASE: "erase",
};

export const STROKE_SIZES = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 16,
  EXTRA_LARGE: 32,
};

export const DRAWING_PATH_PROPERTIES = {
  COLOR: "color",
  SIZE: "size",
};
export const COLORS = {
  GREY: { name: "GREY", hex: "#5f6672" },
  CYAN: { name: "CYAN", hex: "#62dbc8" },
  GREEN: { name: "GREEN", hex: "#7cd651" },
  BROWN: { name: "BROWN", hex: "#d58558" },
  YELLOW: {
    name: "YELLOW",

    hex: "#ffd14d",
  },
  ORANGE: {
    name: "ORANGE",

    hex: "#ff8d48",
  },
  RED: { name: "RED", hex: "#ff5757" },
  PINK: { name: "PINK", hex: "#ff6ed4" },
  PURPLE: {
    name: "PURPLE",

    hex: "#ad6fff",
  },
  BLUE: { name: "BLUE", hex: "#4ebafd" },
  DEEP_BLUE: {
    name: "DEEP_BLUE",

    hex: "#5882f8",
  },
  WHITE: {
    name: "WHITE",

    hex: "#ffffff",
  },
};
export const BRUSH = {
  BRUSH_1: { name: "path1", stroke:2 },
  BRUSH_2: { name: "path2" , stroke:6},
  BRUSH_3: { name: "path3", stroke:8 },
  BRUSH_4: { name: "path4", stroke:20 },
};
const octetRe = "([01]?\\d\\d?|2[0-4]\\d|25[0-5])";
const percentRe = "((?:\\d\\d?(?:\\.[0-9]*)?|100(?:.0*)?))%";
const hexUnitRe = "[0-9A-Fa-f]";
const hexShortContentRe = `(${hexUnitRe})(${hexUnitRe})(${hexUnitRe})`;
const hexContentRe = `(${hexUnitRe}{2})(${hexUnitRe}{2})(${hexUnitRe}{2})`;
const rgbContentRe = `${octetRe}, *${octetRe}, *${octetRe}`;
const hslContentRe = `([0-9]+(?:.[0-9]*)?), *${percentRe}, *${percentRe}`;

const hexShortRe = new RegExp(`^#${hexShortContentRe}$`, "i");
const hexRe = new RegExp(`^#${hexContentRe}$`, "i");
const rgbRe = new RegExp(`^rgb\\(${rgbContentRe}\\)$`, "i");
const hslRe = new RegExp(`^hsl\\(${hslContentRe}\\)$`, "i");
export const isHexColorFormat = (
  str: string | null | undefined
): string[] | false =>
  (str && str.match && (str.match(hexRe) || str.match(hexShortRe))) || false;
export const isRgbColorFormat = (
  str: string | null | undefined
): string[] | false => (str && str.match && str.match(rgbRe)) || false;
export const isHslColorFormat = (
  str: string | null | undefined
): string[] | false => (str && str.match && str.match(hslRe)) || false;
export const getStrokeColor = (color: string) => {
  if (isHexColorFormat(color)) return color;

  switch (color) {
    case COLORS.GREY.name:
      return "#bbbec3";
    case COLORS.CYAN.name:
      return "#62dbc8";
    case COLORS.GREEN.name:
      return "#7cd651";
    case COLORS.BROWN.name:
      return "#d58558";
    case COLORS.YELLOW.name:
      return "#ffd14d";
    case COLORS.ORANGE.name:
      return "#ff8d48";
    case COLORS.RED.name:
      return "#ff5757";
    case COLORS.PINK.name:
      return "#ff6ed4";
    case COLORS.PURPLE.name:
      return "#ad6fff";
    case COLORS.BLUE.name:
      return "#4ebafd";
    case COLORS.DEEP_BLUE.name:
      return "#5882f8";

    default:
      return undefined;
  }
};
