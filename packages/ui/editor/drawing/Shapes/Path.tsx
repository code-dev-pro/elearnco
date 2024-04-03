import React, { useState } from "react";

import { TPath } from "../types";

const Path = (props: TPath) => {
  const { id, d, stroke, strokeWidth,canDelete,deleteDraw } = props;

  const [isOver,setIsOver]=useState<boolean>(false)

  return (
    <path
      key={id}
      strokeWidth={strokeWidth}
      stroke={stroke}
      fill="none"
      d={d}
      strokeLinecap="round"
      cursor={canDelete ? "pointer" : "auto"}
      onClick={():void=> deleteDraw?.(id)}
      onMouseEnter={()=>canDelete && setIsOver(true)}
      onMouseLeave={()=>canDelete && setIsOver(false)}
      opacity={isOver && canDelete ? 0.5 : 1}
    />
  );
};

export default Path;
