export type Tag = {
  uuid: string;
  label: string;
  color: string;
};

export type IDataTag = {
  all: Tag[];
  section: Tag[];
};

export type TTagUI = {
  callback?: (data: IDataTag) => void;
  forUserEmail?: boolean;
  section : Tag[]
  all: Tag[];
};
