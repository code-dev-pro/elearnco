import { GenericObject } from "../global";

export interface IModal {
    onClose: () => void;
    action: string;
    data: GenericObject
  }