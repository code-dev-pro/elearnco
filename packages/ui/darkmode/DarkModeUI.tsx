"use client";
import { useTheme } from "next-themes";
import { useState } from "react";
import React from "react";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";
import { SwitchUI } from "../switch/SwitchUI";

export const DarkModeUI = () => {
  const { theme, setTheme } = useTheme();
  const [isSelected, setIsSelected] = useState<boolean>(theme === "light");

  const _setSelectedTheme = (val: boolean): void => {
    setIsSelected(val);
    setTheme(val ? "light" : "dark");
  };

  return (
    <SwitchUI
      initialState={isSelected}
      content={null}
      setHandler={(val: boolean): void => {
        _setSelectedTheme(val);
      }}
      startContent={<IconUI name="sun" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
      endContent={<IconUI name="moon" width={ICON_SIZE.width} height={ICON_SIZE.height} />}
    />
  );
};
