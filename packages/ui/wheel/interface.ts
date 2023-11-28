export type TDataStamp = {
    index: number;
    time: number;
    title: string;
    id: string;
  };
  
  export interface IDataStamp {
    dataStamp: TDataStamp[];
    mode: string;
    updateSector: (val: TDataStamp[]) => void;
  }

  export interface IWheel {
    data: TDataStamp[];
    onAction: () => void;
  }