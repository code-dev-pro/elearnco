import { getBlockColor } from "lib";
import React, { CSSProperties } from "react";

const MORE_SYLES = {
  backgroundColor: "#2a1c381a",
  backgroundSize: "7.07px 7.07px",
};

type Props = {
  index?: number;
  isExpanded: boolean;
  IsInit?: boolean;
  isVisible: boolean;
  onRef: (ref: HTMLDivElement) => void;
  type: string;
};

export const PlaceholderNodeUI = ({
  type,
  isVisible,
  isExpanded,
  onRef,
  IsInit,
}: Props) => {
  const backgroundColor = getBlockColor(type);

  const setStyle = (): CSSProperties => {
    return {
      height: isExpanded ? (IsInit ? "calc(100vh - 160px)" : "50px") : "0px",
      visibility: isVisible ? "visible" : "hidden",
      transition: isVisible ? "height 200ms" : "none",
      backgroundImage: `linear-gradient(135deg, ${backgroundColor.color} 10%, #0000 0, #0000 50%, ${backgroundColor.color} 0, ${backgroundColor.color} 60%, #0000 0, #0000)`,
      ...MORE_SYLES,
    };
  };

  return <div className="rounded-md" ref={onRef} style={setStyle()} />;
};
