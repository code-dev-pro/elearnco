"use client";
import { Button,Tooltip } from "@nextui-org/react";
import React, { CSSProperties } from "react";
import { GenericObject } from "schemas";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";

export type TPlacement = "top" | "bottom" | "left" | "right";

interface IButtonChild extends IButton, ITooltip {
  icon: ICon;
}

interface IButton {
  withTooltip: boolean;
  size?: "sm" | "md" | "lg" | undefined;
  variant?:
    | "light"
    | "shadow"
    | "flat"
    | "solid"
    | "bordered"
    | "faded"
    | "ghost"
    | undefined;
  isIconOnly: boolean;
  className?: string;
  handleClick: (arg: string | GenericObject) => void;
  label: string;
  isDisabled?: boolean;
  isActive?: boolean;
  style?:CSSProperties
}

interface ITooltip {
  placement?: TPlacement;
  content: string;
  color?:
    | "default"
    | "foreground"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
}

interface ICon {
  iconSize?: number;
  iconName: string;
  iconColor?: string | undefined;
  style?: CSSProperties;
}

interface IProps {
  tooltip: ITooltip;
  button: IButton;
  icon: ICon;
}

export const IconChild = (props: ICon) => {
  const {
    iconSize = ICON_SIZE.width,
    iconName = "",
    iconColor = "white",
    style = {},
  } = props;

  return (
    <IconUI
      color={iconColor}
      width={iconSize}
      height={iconSize}
      name={iconName}
      style={style}
    />
  );
};

export const ButtonChild = React.forwardRef(
  (props: IButtonChild, ref: React.ForwardedRef<HTMLButtonElement | null>) => {
    const {
      isDisabled = false,
      isActive = false,
      size = "md",
      variant = "flat",
      isIconOnly = false,
      handleClick,
      label = "",
      icon,
      className = "",
      withTooltip,
      placement,
      content,
      color,
      style
    } = props;

    return withTooltip ? (
      <Tooltip
        showArrow
        shouldCloseOnBlur
        shouldFlip
        placement={placement ?? "bottom"}
        offset={5}
        content={content}
        color={color ?? "default"}
        isDismissable
      >
        <Button
          ref={ref}
          isDisabled={isDisabled}
          size={size}
          variant={variant}
          isIconOnly={isIconOnly}
          className={className}
          onClick={handleClick}
          aria-label={label}
          style={style}
        >
          <IconChild {...icon} />
          {!isIconOnly && <span>{label}</span>}
          {isActive && (
            <div
              style={{
                borderBottom: "1px solid white",
                width: 10,
                bottom: 0,
                marginBottom: 5,
              }}
              className="absolute"
            />
          )}
        </Button>
      </Tooltip>
    ) : (
      <Button
        ref={ref}
        isDisabled={isDisabled}
        size={size}
        variant={variant}
        isIconOnly={isIconOnly}
        className={className}
        onClick={handleClick}
        aria-label={label}
      >
        <IconChild {...icon} />
        {!isIconOnly && <span>{label}</span>}
      </Button>
    );
  }
);
ButtonChild.displayName = "ButtonChild";
export const ButtonUI = (props: IProps) => {
  const { icon, button, tooltip } = props;

  return <ButtonChild {...button} {...tooltip} icon={icon} />;
};

export default ButtonUI;
