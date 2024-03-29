"use client";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";

interface IProps {
  callback?: (q: string) => void;
  placeholder?: string;
}
const SearchUI = (props: IProps) => {
  const { callback, placeholder = "Type to search..." } = props;
  const [value, setValue] = useState<string>("");

  const changeHandler = (value: string): void => {
    setValue(value);
    callback?.(value);
  };

  return (
    <div className="w-[300px] h-[240px] px-8 rounded-2xl flex justify-center items-center text-white shadow-lg">
      <Input
        label="Search"
        variant="bordered"
        isClearable
        radius="lg"
        value={value}
        onValueChange={changeHandler}
        placeholder={placeholder}
        startContent={
          <IconUI
            width={ICON_SIZE.width}
            height={ICON_SIZE.height}
            name="search"
          />
        }
      />
    </div>
  );
};

export default SearchUI;
