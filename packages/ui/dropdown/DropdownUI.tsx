"use client";
import { OverlayPlacement } from "@nextui-org/aria-utils";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useCallback } from "react";
import { TColor } from "schemas/global";

import { IconUI } from "../icon/IconUI";

interface IShortcut {
  name: string;
  action: string;
}

interface IDropdownItem {
  id: string;
  shortcut?: IShortcut;
  description: string;
  startContent?: string;
  label: string;
  action: string;
  color?: TColor;
  route: string;
  isdisabled: string;
  isvisible: string;
}

export interface IData {
  data: IDropdownItem[];
  id: string;
  title: string;
}

interface IProps {
  showArrow?: boolean;
  placement: OverlayPlacement | undefined;
  data: IData[];
  actionHandler?: (action: string) => void;
  
}

export const DropdownUI = (props: React.PropsWithChildren<IProps>) => {
  const {
    children = null,
    showArrow = true,
    data = [],
    placement = "bottom-end",
    actionHandler,
    
  } = props;

  const showDivider = useCallback((index: number) => {
    return data.length !== 1 && data.length !== index + 1;
  }, []);

  return (
    <Dropdown showArrow={showArrow} placement={placement}>
      <DropdownTrigger>{children}</DropdownTrigger>

      <DropdownMenu aria-label="Menu" variant="faded">
        {data.map((section: IData, index: number) => {
          return (
            <DropdownSection
              title={section.title}
              showDivider={showDivider(index)}
              id={section.id}
              key={section.id}
            >
              {section.data.map((item: IDropdownItem) => {
              
                return (
                  <DropdownItem
                    isDisabled={JSON.parse(item.isdisabled.toLowerCase())}
                    onClick={(): void => actionHandler?.(item.action)}
                   
                    id={item.id}
                    key={item.id}
                    description={item.description}
                    shortcut={item?.shortcut?.name}
                    startContent={
                      item.startContent ? (
                        <IconUI
                          name={item.startContent}
                          width={20}
                          height={20}
                        />
                      ) : (
                        <></>
                      )
                    }
                    color={item.color as TColor}
                  >
                    <span className={item.color==="danger"?"text-danger" : ""}>{item.label}</span>
                  </DropdownItem>
                );
              })}
            </DropdownSection>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};
