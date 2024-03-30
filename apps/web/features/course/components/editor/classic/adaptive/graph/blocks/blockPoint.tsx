import { useRef } from "react";
import { COLOR } from "../const";

const BlockSourcePoint = ({ source, groupId, isTheLast, position }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const _onMousedown = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  };
  const _onPointerdown = (event: React.PointerEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  };

  return (
    <div
      ref={ref}
      onPointerDown={_onPointerdown}
      onMouseDown={_onMousedown}
      className="prevent-group-drag w-8 h-8 absolute rounded-full cursor-copy flex justify-center items-center pointer-events-all"
      data-testid="endpoint"
      style={{
        right: position === "left" ? "100%" : "-16px",
        top: "50%",
        marginTop: "-16px",
        marginRight: position === "left" ? "-16px" : "0",
      }}
    >
      <div
        style={{ background: "black" }}
        className="w-5 h-5 rounded-full  cursor-copy flex justify-center items-center pointer-events-all"
      >
        <div
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ borderWidth: 3, borderColor: COLOR }}
        >
          <span className="flex w-full h-full justify-center items-center text-xs absolute top-0 left-0">
            {isTheLast ? "+" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlockSourcePoint;
