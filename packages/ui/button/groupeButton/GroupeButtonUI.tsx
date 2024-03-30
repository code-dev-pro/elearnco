"use client";
import { ButtonGroup } from "@nextui-org/react";
import React from "react";
import { GenericObject } from "schemas";

import { ICON_SIZE } from "../../const";
import ButtonUI, { TPlacement } from "../ButtonUI";
import Comments from "../../comments";

type TOrientation = "horizontal" | "vertical";

interface IProps {
  data: GenericObject[];
  isDisabled: boolean;
  orientation: TOrientation;
  onClickHandler: (action: string, id: string, uuid: string) => void;
  blockID?: string;
  blockUUID?: string;
  placementTooltip?: TPlacement;
}
export const GoupeButtonUI = React.memo((props: IProps) => {
  const {
    data = [],
    isDisabled = false,
    onClickHandler,
    blockID = "",
    blockUUID = "",
    placementTooltip = "bottom",
  } = props;

  return (
    <ButtonGroup size="sm" radius="full" className="flex justify-end">
      {data.map((item) => (
        <ButtonUI
          key={item.id}
          tooltip={{
            content: item.label,
            placement: placementTooltip,
          }}
          button={{
            handleClick: (): void =>
              onClickHandler(item.shortcut.action, blockID, blockUUID),
            isIconOnly: true,
            label: item.label,
            withTooltip: true,
            className: "",
            isDisabled: JSON.parse(item.isdisabled) || isDisabled,
            size:'sm'
          }}
          icon={{ iconSize: ICON_SIZE.width, iconName: item.icon }}
        />
      ))}
      <Comments uuid={blockUUID} id={blockID} />
    </ButtonGroup>
  );
});

GoupeButtonUI.displayName = "GoupeButton";
