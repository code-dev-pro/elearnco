import { CSSProperties } from "react";

export const WRAPPER_STYLE = {
    backgroundColor: "#9ca3af1a",
    backgroundImage:
      "linear-gradient(135deg,#6b728080 10%,#0000 0,#0000 50%,#6b728080 0,#6b728080 60%,#0000 0,#0000)",
    backgroundSize: "7.07px 7.07px",
  } as CSSProperties;
  export const DRAG_BLOCK_STYLE = {
    maxWidth: "500px",
    userSelect: "none",
    height: "67px",
    pointerEvents: "none",
    zIndex: 500,
  } as CSSProperties;