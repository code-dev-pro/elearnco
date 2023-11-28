import { nanoid } from "lib/utils";
import { TDataStamp } from "./interface";

export const DIM = 500;
export const MAX_SECTORS = 9;
export const MIN_SECTORS = 3;
export const PROPS_BUTTON = { fill: "transparent", width: 22, height:22 };
export const BASE_COLOR_HEX = "#d34418";
export const createDatas = (): TDataStamp[] => {
    const data = [] as TDataStamp[];
    for (let pas = 0; pas < MIN_SECTORS + 2; pas++) {
      data.push({
        index: pas + 1,
        time: 0,
        title: `Section ${pas+1}`,
        id: nanoid(7),
      });
    }
  
    return data;
  };