"use client";
import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { EActionsCourse, EActionsFolder,EActionskeysCourse, EActionskeysFolder } from "schemas";

import { BACKGROUND_NO_IMAGE } from "../const";
import HotkeysUI from "../hotkeys/HotkeysUI";

interface IProps {
  clickHandler?: (action:string) => void;
}

export const AddCardUI = (props: IProps) => {
  const { clickHandler } = props;

  return (
    <Card style={{ width: 300, height: 350 }} className="py-0 cursor-pointer">
      <CardBody className="p-0">
        <div className="w-full h-full" style={{ ...BACKGROUND_NO_IMAGE }} />
        <div className="flex flex-col w-full h-full absolute">
          <div
            onClick={() => clickHandler?.(EActionsCourse.ADD)}
            className="flex items-center justify-center w-full h-full"
          >
            <div className="flex flex-col items-center justify-center">
              <p className="uppercase font-bold select-none text-small text-center mb-2">
                Add new course
              </p>
              <HotkeysUI collectionKeys={EActionskeysCourse.ADD} />
            </div>
          </div>
          <div
            onClick={() => clickHandler?.(EActionsFolder.ADD)}
            className="flex items-center justify-center w-full h-full"
          >
            <div className="flex flex-col items-center justify-center">
              <p className="uppercase font-bold select-none text-small text-center mb-2">
                Add new folder
              </p>
              <HotkeysUI collectionKeys={EActionskeysFolder.ADD} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
