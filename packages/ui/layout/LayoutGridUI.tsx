import React from "react";
const GRID = {
  display: "grid",
  justifyItems: "start",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
};

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
