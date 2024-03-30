"use client";
import { Avatar, Select, SelectedItems, SelectItem } from "@nextui-org/react";
import { capitalizeFirstLetterOfEachWord } from "lib/utils";
import React, { useState } from "react";

type TLabelPlacement = "inside" | "outside" | "outside-left";
type TVariant = "bordered" | "flat" | "faded" | "underlined" | undefined;
interface IProps {
  data: any;
  label: string;
  placeholder: string;
  labelPlacement: TLabelPlacement;
  onChange: (value: string) => void;
  variant?: TVariant;
  hasAvatar?: boolean;
  selectedKey: string;
  isRequired?: boolean;
}

export const SelectUI = (props: IProps) => {
  const {
    data = [],
    label = "label",
    placeholder = "placeholder",
    labelPlacement = "outside",
    onChange,
    variant = "bordered",
    hasAvatar = false,
    selectedKey = "",
    isRequired,
  } = props;

  const [selectedValue, setSelectValue] = useState<string[]>([
    selectedKey || data[0]?.id,
  ]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange?.(e.target.value);
    setSelectValue([e.target.value]);
  };

  return (
    <Select
      isRequired={isRequired}
      items={data}
      label={label}
      aria-label="Select"
      variant={variant}
      disableAnimation
      placeholder={placeholder}
      labelPlacement={labelPlacement}
      classNames={{
        base: "max-w-xs w-auto",
        trigger: "min-h-unit-12 h-12 bg-default-50",
      }}
      style={{
        width: "12.5rem",
      }}
      size="sm"
      onChange={onChangeHandler}
      defaultSelectedKeys={selectedValue}
      selectedKeys={selectedValue}
      disabledKeys={selectedValue}
      renderValue={(items: SelectedItems<any>) => {
        return items.map((item) => (
          <div key={item.data.id} className="flex items-center gap-2">
            {hasAvatar ? (
              <Avatar
                alt={item.data.name}
                className="flex-shrink-0"
                size="sm"
                src={item.data.image}
              />
            ) : (
              <></>
            )}
            <div className="flex flex-col">
              <span>{item.data.name}</span>
            </div>
          </div>
        ));
      }}
    >
      {(item) => (
        <SelectItem
          key={item?.id}
          textValue={capitalizeFirstLetterOfEachWord(item.name)}
        >
          <div className="flex gap-2 items-center">
            {hasAvatar ? (
              <Avatar
                alt={item.name}
                className="flex-shrink-0"
                size="sm"
                src={item.image}
              />
            ) : (
              <></>
            )}
            <span className="text-small">
              {capitalizeFirstLetterOfEachWord(item.name)}
            </span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};
