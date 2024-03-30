"use client";
import {
  Select,
  SelectedItemProps,
  SelectedItems,
  SelectItem,
} from "@nextui-org/react";
import { useCallback, useRef } from "react";
import React from "react";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";
import Fireworks from "./Fireworks";
import { EAnimationEffect, IRef } from "./types";

type TItem = {
  id: EAnimationEffect;
  name: EAnimationEffect;
};
export const CONFETTIS_EFFECT = [
  {
    id: EAnimationEffect.snow,
    name: EAnimationEffect.snow,
  },
  {
    id: EAnimationEffect.cannon,
    name: EAnimationEffect.cannon,
  },
  {
    id: EAnimationEffect.fireworks,
    name: EAnimationEffect.fireworks,
  },
  {
    id: EAnimationEffect.realist,
    name: EAnimationEffect.realist,
  },
];

const ConfettisEffect = () => {
  const ref = useRef<IRef | null>(null);

  const startAnimation = (type: EAnimationEffect): void => {
    ref?.current?.startAnimation(type);
  };

  const stopAnimation = useCallback((): void => {
    ref?.current?.stopAnimation();
  }, []);

  return (
    <div>
      <Select
        variant="faded"
        items={CONFETTIS_EFFECT as TItem[]}
        label="Confettis Effect"
        size="sm"
        placeholder="Select an effect"
        labelPlacement="outside"
        classNames={{
          base: "max-w-xs",
          trigger: "h-12",
        }}
        onChange={stopAnimation}
        renderValue={(items: SelectedItems<TItem>) => {
          return items.map((item: SelectedItemProps<TItem>) => (
            <div key={item?.data?.id} className="flex items-center gap-2">
              <IconUI
                name={
                  item?.data?.name ? item.data.name : EAnimationEffect.cannon
                }
                width={ICON_SIZE.width}
                height={ICON_SIZE.height}
              />

              <div className="flex flex-col">
                <span>{item?.data?.name}</span>
              </div>
            </div>
          ));
        }}
      >
        {(item: TItem) => (
          <SelectItem
            key={item.id}
            textValue={item.name}
            onMouseLeave={stopAnimation}
            onMouseEnter={() => startAnimation(item.name)}
            variant="bordered"
          >
            <div className="flex gap-2 items-center">
              <IconUI
                name={item?.name}
                width={ICON_SIZE.width}
                height={ICON_SIZE.height}
              />
              <div className="flex flex-col">
                <span className="text-small">{item?.name}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>

      <Fireworks ref={ref} />
    </div>
  );
};

export default ConfettisEffect;
