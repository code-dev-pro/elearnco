import React from "react";

import { TCircle } from "../types";

const Circle = (props: TCircle) => {
  const { x, y, fill = "#FDBC07", stroke = "#000", r = 4, cursor,onDoubleClick,id } = props;

  return (
    <circle
      cx={x}
      cy={y}
      r="4"
      fill={fill}
      stroke={stroke}
      is-handle="true"
      style={{ cursor: cursor }}
      onDoubleClick={()=>onDoubleClick(id)}
    />
  );
};
export default Circle;
