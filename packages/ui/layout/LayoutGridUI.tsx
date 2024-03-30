import React from "react";

import { GRID } from "./const";

interface IProps {
  classnames?: string;
}

export const LayoutGridUI = (props: React.PropsWithChildren<IProps>) => {
  const { children, classnames } = props;

  return (
    <div style={{ ...GRID }} className={`w-full h-auto ${classnames}`}>
      {children}
    </div>
  );
};
