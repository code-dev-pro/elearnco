"use client";
import { NavbarContent } from "@nextui-org/react";
import React from "react";
import { DATA_MENU_PREVIEW } from "schemas/mocks";
import { useDevicePreviewStore } from "store";

import { GoupeButtonUI } from "../..";
import ButtonBack from "./ButtonBack";

const BarPreviewTop = () => {
  const { onSetDevice } = useDevicePreviewStore();

  const _onClickHandler = (action: string): void => {
    onSetDevice(action);
  };

  return (
    <>
      <NavbarContent justify="start">
        <ButtonBack />
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <GoupeButtonUI
          data={DATA_MENU_PREVIEW}
          isDisabled={false}
          orientation="horizontal"
          onClickHandler={_onClickHandler}
        />
      </NavbarContent>
    </>
  );
};

export default BarPreviewTop;
