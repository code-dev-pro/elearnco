"use client";
import { Tooltip } from "@nextui-org/react";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type TEditable = {
  callback: (txt: string) => void;
  defaultText: string;
  isReadonly?: boolean;
};

const EditableUI = (props: TEditable) => {
  const { defaultText, callback, isReadonly = false } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputText, setText] = useState<string>(defaultText);
  const refTimeout = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const _onBlur = (): void => {
    setIsEditing(false);
    callback?.(inputText);
  };

  const _onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const _target = e.target as HTMLInputElement;
    setText(_target.value);
  };

  const _onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === "Enter") {
      _onBlur();
    }
  };

  const _onEdit = (): void => {
    if (isReadonly) return;
    setIsEditing(true);
    refTimeout.current = setTimeout(() => {
      if (refTimeout.current) clearTimeout(refTimeout.current);
      inputRef.current?.focus();
    }, 250);
  };
  useEffect(() => {
    setText(defaultText);

    return () => {
      if (refTimeout.current) clearTimeout(refTimeout.current);
    };
  }, [defaultText]);
  return isEditing ? (
    <input
      ref={inputRef}
      onKeyDown={_onKeyDown}
      onChange={_onChange}
      onBlur={_onBlur}
      className="bg-transparent outline-none shadow-none appearance-none focus:appearance-none w-full"
      type="text"
      placeholder={inputText}
      value={inputText}
    />
  ) : isReadonly ? (
    <div
      className="select-none cursor-pointer truncate w-fit"
      onClick={_onEdit}
    >
      {inputText}
    </div>
  ) : (
    <Tooltip showArrow content="Rename">
      <div
        className="select-none cursor-pointer truncate w-fit"
        onClick={_onEdit}
      >
        {inputText}
      </div>
    </Tooltip>
  );
};

export default EditableUI;
