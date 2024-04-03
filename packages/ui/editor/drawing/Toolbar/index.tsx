import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import React, { useMemo, useState } from "react";

import ButtonUI from "../../../button/ButtonUI";
import { ICON_SIZE } from "../../../const";
import { IconUI } from "../../../icon/IconUI";
import { getBrushName } from "../../utils";
import { BRUSH, COLORS } from "../const";
import { TBrush, TPalette, TToolbar } from "../types";

const ColorPalette = (props: TPalette) => {
  const { setActiveColor, closeColor, activeColor } = props;

  const colorPalette = useMemo(() => {
    return Object.values(COLORS).map((color) => ({
      name: color.name,
      hex: color.hex,
    }));
  }, []);

  return (
    <>
      {colorPalette?.map((color) => (
        <div
          key={color.name}
          style={{
            backgroundColor: color.hex,
            border: `2px ${
              activeColor === color.hex ? "white" : color.hex
            } solid`,
          }}
          className="rounded-full w-5 h-5 cursor-pointer"
          onClick={() => {
            closeColor();
            setActiveColor(color.hex);
          }}
        />
      ))}
    </>
  );
};
const BrushPalette = (props: TBrush) => {
  const { setActiveBrush, closeBrush, activeColor, activeBrush } = props;

  const brushPalette = useMemo(() => {
    return Object.values(BRUSH).map((brush) => ({
      name: brush.name,
      stroke: brush.stroke,
    }));
  }, []);

  return (
    <>
      {brushPalette?.map((brush) => (
        <div
          key={brush.name}
          className="rounded-full w-7 h-7 cursor-pointer flex justify-center items-center"
          style={{
            border: `2px ${
              activeBrush === brush.stroke ? activeColor : "transparent"
            } solid`,
          }}
          onClick={() => {
            closeBrush();
            setActiveBrush(brush.stroke);
          }}
        >
          <span className="mt-1">
            <IconUI
              name={brush.name}
              width={ICON_SIZE.width}
              height={ICON_SIZE.height}
              color={activeColor}
              style={{ fill: activeColor }}
            />
          </span>
        </div>
      ))}
    </>
  );
};

const Toolbar = (props: TToolbar) => {
  const {
    getActiveTool,
    getActiveColor,
    getActiveBrush,
    clean,
    defaultColor = COLORS.BLUE.hex,
    defaultBrush = 2,
    hasActiveClean=false
  } = props;
  const [isOpenColor, setIsOpenColor] = useState<boolean>(false);
  const [isOpenBrush, setIsOpenBrush] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<string>(defaultColor);
  const [activeBrush, setActiveBrush] = useState<number>(defaultBrush);
  const [activeTool, setActiveTool] = useState<string>("pen");

  const _setActiveColor = (color: string): void => {
    setActiveColor(color);
    getActiveColor(color);
  };
  const _setActiveBrush = (brush: number): void => {
    setActiveBrush(brush);
    getActiveBrush(brush);
  };
  const _setActiveTool = (tool: string): void => {
    setActiveTool(tool);
    getActiveTool(tool);
  };

  const _openColor = (): void => {
    setIsOpenColor(true);
    setIsOpenBrush(false);
  };

  const _closeColor = (): void => {
    setIsOpenColor(false);
  };

  const _openBrush = (): void => {
    setIsOpenBrush(true);
    setIsOpenColor(false);
  };

  const _closeBrush = (): void => {
    setIsOpenBrush(false);
  };

  return (
    <div className="flex flex-col">
      <ButtonUI
        tooltip={{
          content: "Draw",
          placement: "right",
        }}
        button={{
          handleClick: (): void => _setActiveTool("pen"),
          isIconOnly: true,
          label: "Draw",
          withTooltip: true,
          className: "",
          isDisabled: false,
          isActive: activeTool === "pen",
          style: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 },
          size: "sm",
          variant: "solid",
        }}
        icon={{ iconSize: ICON_SIZE.width, iconName: "pen" }}
      />
      {/* <ButtonUI
        tooltip={{
          content: "Select",
          placement: "top",
        }}
        button={{
          handleClick: () => _setActiveTool("select"),
          isIconOnly: true,
          label: "Select",
          withTooltip: true,
          className: "",
          isDisabled: false,
        }}
        icon={{ iconSize: ICON_SIZE.width, iconName: "pointer" }}
      /> */}
      <ButtonUI
        tooltip={{
          content: "Poly",
          placement: "right",
        }}
        button={{
          handleClick: (): void => _setActiveTool("pentagon"),
          isIconOnly: true,
          label: "Poly",
          withTooltip: true,
          className: "",
          isDisabled: false,
          isActive: activeTool === "pentagon",
          style: { borderRadius: 0 },
          size: "sm",
          variant: "solid",
        }}
        icon={{ iconSize: ICON_SIZE.width, iconName: "pentagon" }}
      />
      <ButtonUI
        tooltip={{
          content: "Erase",
          placement: "right",
        }}
        button={{
          handleClick: (): void => _setActiveTool("erase"),
          isIconOnly: true,
          label: "Erase",
          withTooltip: true,
          className: "",
          isDisabled: false,
          isActive: activeTool === "erase",
          style: { borderRadius: 0 },
          size: "sm",
          variant: "solid",
        }}
        icon={{ iconSize: ICON_SIZE.width, iconName: "eraser" }}
      />
      <Popover
        isOpen={isOpenColor}
        placement="right"
        offset={10}
        showArrow
        shouldBlockScroll
        shouldCloseOnBlur
        onOpenChange={(open): void => setIsOpenColor(open)}
      >
        <PopoverTrigger>
          <span role="button">
            <ButtonUI
              tooltip={{
                content: "Color",
                placement: "right",
              }}
              button={{
                handleClick: (): void => _openColor(),
                isIconOnly: true,
                label: "Color",
                withTooltip: true,
                className: "",
                isDisabled: false,
                style: { borderRadius: 0 },
                size: "sm",
                variant: "solid",
              }}
              icon={{
                iconSize: ICON_SIZE.width,
                iconName: "circle",
                iconColor: activeColor,
              }}
            />
          </span>
        </PopoverTrigger>
        <PopoverContent>
          <div
            style={{ width: 110, height: 90 }}
            className="flex flex-wrap py-2 gap-2 overflow-hidden"
          >
            <ColorPalette
              closeColor={_closeColor}
              setActiveColor={_setActiveColor}
              activeColor={activeColor}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Popover
        isOpen={isOpenBrush}
        placement="right"
        offset={10}
        showArrow
        shouldBlockScroll
        shouldCloseOnBlur
        onOpenChange={(open) => setIsOpenBrush(open)}
      >
        <PopoverTrigger>
          <span role="button">
            <ButtonUI
              tooltip={{
                content: "Brush",
                placement: "right",
              }}
              button={{
                handleClick: (): void => _openBrush(),
                isIconOnly: true,
                label: "Brush",
                withTooltip: true,
                className: "",
                isDisabled: false,
                style: { borderRadius: 0 },
                size: "sm",
                variant: "solid",
              }}
              icon={{
                iconSize: ICON_SIZE.width,
                iconName: getBrushName(activeBrush),
                iconColor: activeColor,
                style: { fill: activeColor },
              }}
            />
          </span>
        </PopoverTrigger>
        <PopoverContent>
          <div
            style={{ width: 140, height: 40 }}
            className="flex flex-wrap py-2 gap-2 overflow-hidden"
          >
            <BrushPalette
              closeBrush={_closeBrush}
              setActiveBrush={_setActiveBrush}
              activeBrush={activeBrush}
              activeColor={activeColor}
            />
          </div>
        </PopoverContent>
      </Popover>
      <ButtonUI
        tooltip={{
          content: "Erase all",
          placement: "right",
        }}
        button={{
          handleClick: () => clean(),
          isIconOnly: true,
          label: "Erase all",
          withTooltip: true,
          className: "",
          isDisabled: !hasActiveClean,
          style: { borderTopRightRadius: 0, borderTopLeftRadius: 0 },
          size: "sm",
          variant: "solid",
        }}
        icon={{ iconSize: ICON_SIZE.width, iconName: "delete" }}
      />
    </div>
  );
};

export default Toolbar;
