"use client";
import { Button, Divider, Tooltip } from "@nextui-org/react";
import { matchRoute } from "lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next13-progressbar";
import React, { useMemo } from "react";
import { TFixedInPosition, TPosition } from "schemas/global";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";
import BarUI from "./BarUI";

interface IProps {
  fixedInPosition: TFixedInPosition;
  data: IItem[];
  classnames?: string;
  position?: TPosition;
}

interface IItem {
  id: string;
  label: string;
  shortcut?: {
    name: string;
    action: string;
  };
  route?: string;
  description: string;
  icon?: string;
  hastooltip: boolean;
  isvisible?: string;
  isdisabled?: string;
}

const ButtonWithIcon = React.forwardRef<HTMLElement, IItem>((props, ref) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    router.push(`/${props.route}`);
  };

  const isActive =
    matchRoute(pathname, props.route as string) ||
    (pathname.includes("editor") && props?.route?.includes("courses"));

  return (
    <span ref={ref} {...props} {...{ hastooltip: String(props.hastooltip) }}>
      <Button
        size="sm"
        variant="solid"
        isIconOnly
        className={`rounded-full ${isActive ? "bg-primary" : ""}`}
        onClick={(e) => handleClick(e)}
      >
        <div className="flex flex-col items-center">
          <IconUI
            color={isActive ? "white" : "black"}
            width={ICON_SIZE.width} height={ICON_SIZE.height}
            name={props.icon ? props.icon : "home"}
          />
        </div>
      </Button>
    </span>
  );
});
ButtonWithIcon.displayName = "ButtonWithIcon";
export const MenuUI = (props: IProps) => {
  const { data, fixedInPosition, position = "fixed" } = props;

  const _getPosition = () => {
    if (fixedInPosition === "top") return "bottom";
    if (fixedInPosition === "bottom") return "top";
    return "left";
  };

  const setChildren = (item: IItem) => {
    if (item.label === "divider")
      return <Divider orientation="vertical" className="auto" />;
    if (item.hastooltip)
      return (
        <Tooltip
          showArrow
          shouldCloseOnBlur
          shouldFlip
          placement={_getPosition()}
          offset={5}
          content={item.label}
          color="foreground"
        >
          <ButtonWithIcon {...item} />
        </Tooltip>
      );

    return <ButtonWithIcon {...item} />;
  };

  const DATA_MEMO = useMemo(
    () =>
      data.map((item: IItem) => <span key={item.id}>{setChildren(item)}</span>),
    []
  );

  return (
    <BarUI position={position} fixedInPosition={fixedInPosition}>
      {DATA_MEMO}
    </BarUI>
  );
};
