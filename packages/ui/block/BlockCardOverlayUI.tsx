import { Chip } from "@nextui-org/react";
import { getBlockColor } from "lib";
import React, { CSSProperties, useMemo } from "react";
import { DraggableBlockType } from "schemas";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";

export const BlockCardOverlayUI = ({
  type,
  onMouseUp,
  ...props
}: { style: CSSProperties } & { onMouseUp: () => void } & {
  type: DraggableBlockType | undefined;
}) => {
  const BACKGROUND_COLOR = useMemo(
    () => getBlockColor(type as string).backgroundColor,
    []
  );
  const ICON = type?.toLocaleLowerCase().trim().replace(/\s/g, "");

  return (
    <Chip
      startContent={<IconUI name={ICON ?? ""} width={ICON_SIZE.width} height={ICON_SIZE.height} />}
      style={{ ...props.style }}
      className="fixed top-0 left-0 select-none pointer-events-none"
      size="lg"
      radius="sm"
      color={BACKGROUND_COLOR}
    >
      {type}
    </Chip>
  );
};
