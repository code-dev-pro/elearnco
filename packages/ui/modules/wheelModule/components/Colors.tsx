import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import React, { useState } from "react";
import { TColor } from "schemas";

interface IProps {
  onAction?: (color: TColor) => void;
  defaultColor: string;
}

const PaletteColors = (props: IProps) => {
  const { onAction,defaultColor } = props;
  const [color, setColor] = useState<TColor>(defaultColor as TColor);

  const _clickHandler = (color: TColor): void => {
    setColor(color);
    onAction?.(color);
  };
 

  return (
    <div className="p-10">
      <Popover shouldFlip shouldCloseOnBlur shouldBlockScroll placement="bottom" showArrow offset={10}>
        <PopoverTrigger>
          <Button color={color}>Customize</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px]">
          {(titleProps) => (
            <div className="px-1 py-2 w-full">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              >
                Colors
              </p>
              <div className="mt-2 flex gap-2 w-full">
                <div
                  onClick={() => _clickHandler("secondary")}
                  className="w-6 h-6 rounded-full bg-secondary cursor-pointer"
                  style={{transform:color==="secondary"? "scale(1.2)": "scale(1)"}}
                />
                <div
                  onClick={() => _clickHandler("primary")}
                  className="w-6 h-6 rounded-full bg-primary cursor-pointer"
                  style={{transform:color==="primary"? "scale(1.2)": "scale(1)"}}
                />

                <div
                  onClick={() => _clickHandler("warning")}
                  className="w-6 h-6 rounded-full bg-warning cursor-pointer"
                  style={{transform:color==="warning"? "scale(1.2)": "scale(1)"}}
                />
                <div
                  onClick={() => _clickHandler("success")}
                  className="w-6 h-6 rounded-full bg-success cursor-pointer"
                  style={{transform:color==="success"? "scale(1.2)": "scale(1)"}}
                />
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PaletteColors;
