import { OColor } from "schemas";

export type TDataStamp = {
  index: number;
  time: number;
  title: string;
  id: string;
};

export interface IDataStamp {
  dataStamp: TDataStamp[];

  updateSector: (val: TDataStamp[]) => void;
}

export interface IWheel {
  data: TDataStamp[];
  color: string;
  onChange: (datas: any) => void;
  isReadOnly: boolean;
  size?:number
}
export type OColorType = typeof OColor;
