import React from "react";

import { IMarker } from "../types/types";

export const CountUI = (props: IMarker) => {
  const { type, isSelected } = props;

  return (
    <span
      className={`letter-marker ${type} ${isSelected ? "isSelected" : ""}`}
    />
  );
};
export default CountUI;
