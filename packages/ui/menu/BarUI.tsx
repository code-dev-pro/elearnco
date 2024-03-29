import React, { useCallback } from "react";

type TPosition = "top" | "bottom" | "left" | "right";

interface IProps {
  position: string;
  fixedInPosition: TPosition;
  bgColor?: string;
}

export const BarUI = (props: React.PropsWithChildren<IProps>) => {
  const { fixedInPosition = "top", children, position = "fixed",bgColor='' } = props;

  const getPosition = useCallback((): string => {
    if (fixedInPosition === "top") return "top-0 left-0";
    if (fixedInPosition === "bottom") return "bottom-0 left-0";
    if (fixedInPosition === "left") return "left-0 top-0";
    if (fixedInPosition === "right") return "right-0 top-0";
    return "top-0";
  }, [fixedInPosition]);
  const orientation = useCallback((): string => {
    if (fixedInPosition === "top" || fixedInPosition === "bottom")
      return "flex-row";
    if (fixedInPosition === "left" || fixedInPosition === "right")
      return "flex-col";
    return "row";
  }, [fixedInPosition]);

  const dimension = useCallback((): string => {
    if (fixedInPosition === "top" || fixedInPosition === "bottom")
      return "w-full justify-center";
    if (fixedInPosition === "left" || fixedInPosition === "right")
      return "h-full items-center";
    return "w-full";
  }, [fixedInPosition]);

  return (
    <div
     
      className={`${position} ${getPosition()} ${dimension()} z-40`}
    >
      <div className={`flex ${dimension()}`}>
        <div
          className={`flex justify-center w-full p-2 gap-2 ${orientation()} ${bgColor}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};



export default BarUI;
