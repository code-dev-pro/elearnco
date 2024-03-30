"use client";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
} from "@nextui-org/react";
import useLocalStorage from "customhooks/use-local-storage";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useActivityStore } from "store/activity";

import { STORAGE_NAME_MAGIC_KEY } from "../const";
import { DarkModeUI } from "../darkmode/DarkModeUI";
import { LangUI } from "../lang/LangUI";

export const SettingsUI = () => {
  const [keyOpenAi, setKeyOpenAi] = useLocalStorage<string>(STORAGE_NAME_MAGIC_KEY, "");
  const startKey = keyOpenAi?.substring(0, 6);
  const EndKey = "*".repeat(keyOpenAi.length - startKey.length);

  const [inputValue, setInputValue] = useState<string>(
    startKey && EndKey ? startKey + EndKey : ""
  );

  const { onBeginActivity } = useActivityStore();

  const t = useTranslations("settings");
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputValue(event.target.value);
  };

  const saveKey = (): void => {
    if (inputValue.length > 0) {
      setKeyOpenAi(inputValue);
      onBeginActivity();
    }
  };

  const handleInputEnter = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      if (inputValue.length > 0) {
        saveKey();
      }
    }
  };

  return (
    <>
      <p>{t("message")}</p>
      <LangUI />
      <Spacer y={2} />
      <p>Mode dark ou light ?</p>
      <DarkModeUI />
      <Spacer y={2} />
      <div className="flex items-center gap-2 justify-center">
        <Input
          type="text"
          label="OpenAi API key"
          placeholder="sk-"
          labelPlacement="inside"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputEnter}
        />
        <Popover
          showArrow
          backdrop="opaque"
          placement="right"
          classNames={{
            base: ["before:bg-default-200"],
            content: [
              "py-3 px-4 border border-default-200",
              "bg-gradient-to-br from-white to-default-300",
              "dark:from-default-100 dark:to-default-50",
            ],
          }}
        >
          <PopoverTrigger>
            <Button isIconOnly radius="full" size="sm" startContent={<>i</>} />
          </PopoverTrigger>
          <PopoverContent className="w-[240px]">
            {(titleProps) => (
              <div className="px-1 py-2">
                <h3 className="text-small font-bold" {...titleProps}>
                  Information
                </h3>
                <div className="text-tiny">
                  Your key will allow you to test the features related to the
                  use of AI. It is only saved within your browser and is
                  automatically deleted after 10 minutes of inactivity or if you
                  exit the application.
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <Button isDisabled={inputValue.length > 0 ? false : true} onClick={saveKey}>Save my key</Button>
    </>
  );
};

export default SettingsUI;
