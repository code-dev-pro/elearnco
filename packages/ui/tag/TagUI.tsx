"use client";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Tooltip,
} from "@nextui-org/react";
import { getRandomItem, nanoid, removeObjectById, updateObjectById } from "lib";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";
import { COLORS } from "./const";
import { Tag, TTagUI } from "./types";
const emailSchema = z.string().email();
const ListColors = (props: {
  selected: Tag;
  handleChangeColor: (color: string, tag: Tag) => void;
  forUserEmail: boolean;
}) => {
  const { selected, handleChangeColor, forUserEmail } = props;
  const _selectColor = (color: string): void => {
    handleChangeColor(color, selected);
  };

  const _COLORS = forUserEmail
    ? COLORS.filter(
        (color) => color.name === "Green" || color.name === "Orange"
      )
    : COLORS;

  return _COLORS.map((col) => (
    <Button
      key={col.id}
      className="w-full justify-start flex"
      variant="light"
      onClick={() => _selectColor(col.color)}
      size="sm"
      startContent={
        <div
          style={{
            backgroundColor: col.color,
            borderRadius: " 50%",
            width: "20px",
            height: "20px",
          }}
        />
      }
      endContent={
        <div style={{ opacity: selected?.color === col.color ? 1 : 0 }}>
          <IconUI
            name="check"
            height={ICON_SIZE.height}
            width={ICON_SIZE.width}
          />
        </div>
      }
    >
      {forUserEmail ? col.status : col.name}
    </Button>
  ));
};

const ListboxWrapper = ({ children }: React.PropsWithChildren) => (
  <div className="w-full relative border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 z-20">
    {children}
  </div>
);

export const TagUI = (props: TTagUI) => {
  const { callback, forUserEmail = !true, section = [], all = [] } = props;
  const [isEdition, setIsEdition] = useState<boolean>(false);
  const [values, setValues] = useState<Tag[]>(all);
  const [valuesSelected, setValuesSelected] = useState<Tag[]>(section);
  const [currentValue, onChangeValue] = useState<string>("");

  //Keeping state values as ref because deleted
  //or other actions from popover keep bad state values
  //maybe due to a memo content popover component (??)
  const valuesMemo = useRef<Tag[]>([]);
  const valuesSelectedMemo = useRef<Tag[]>([]);

  const _addFromValuesToValueSelected = (tag: Tag): void => {
    const checkIfExist = valuesSelectedMemo.current.some(
      (value) => value.label === tag.label
    );

    if (!checkIfExist) {
      const newState = [...valuesSelectedMemo.current, tag];
      valuesSelectedMemo.current = newState;
      setValuesSelected(newState);
      callback?.({ all: values, section: newState });
    }
  };
  const _handleDeleteInSelected = (tag: Tag): void => {
    const newState = removeObjectById(valuesSelected, tag.uuid);
    valuesSelectedMemo.current = newState;
    setValuesSelected(newState);
    callback?.({ all: values, section: newState });
  };
  const _onChangeValue = (event: ChangeEvent<HTMLInputElement>): void => {
    const _target = event.currentTarget as HTMLInputElement;
    onChangeValue(_target.value);
  };
  const _onChangeValueInPop = (
    event: ChangeEvent<HTMLInputElement>,
    tag: Tag
  ): void => {
    const id = tag.uuid;
    const newValue = event.currentTarget.value;
    if (newValue.length === 0) return;
    const newStateSelected = updateObjectById(valuesSelectedMemo.current, id, {
      label: newValue,
    });
    valuesSelectedMemo.current = newStateSelected;
    setValuesSelected(newStateSelected);

    const newState = updateObjectById(valuesMemo.current, id, {
      label: newValue,
    });
    valuesMemo.current = newState;
    setValues(newState);
    callback?.({ all: newState, section: newStateSelected });
  };

  const _handleDelete = (tag: Tag): void => {
    const newState = removeObjectById(valuesMemo.current, tag.uuid);
    valuesMemo.current = newState;
    setValues(newState);
    const newStateSelected = removeObjectById(
      valuesSelectedMemo.current,
      tag.uuid
    );
    valuesSelectedMemo.current = newStateSelected;
    setValuesSelected(newStateSelected);
    callback?.({ all: newState, section: newStateSelected });
  };

  const _handleChangeColor = (color: string, tag: Tag): void => {
    const id = tag.uuid;
    const newValue = color;
    const newStateSelected = updateObjectById(valuesSelectedMemo.current, id, {
      color: newValue,
    });
    valuesSelectedMemo.current = newStateSelected;
    setValuesSelected(newStateSelected);
    const newState = updateObjectById(valuesMemo.current, id, {
      color: newValue,
    });
    valuesMemo.current = newState;
    setValues(newState);
    callback?.({ all: newState, section: newStateSelected });
  };
  const _onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.code === "Enter") {
      e.preventDefault();

      const _target = e.target as HTMLInputElement;

      const checkIfExist = values.some(
        (value) => value.label === _target.value
      );

      if (forUserEmail) {
        if (!emailSchema.parse(_target.value)) return;
      }

      if (_target.value !== "" && !checkIfExist) {
        const _color = forUserEmail
          ? COLORS.find((color) => color.name === "Orange")
          : getRandomItem(COLORS);
        const _newTag = {
          label: _target.value,
          uuid: nanoid(7),
          color: _color?.color as string,
        };
        setValuesSelected([...valuesSelected, _newTag]);
        valuesSelectedMemo.current = [...valuesSelected, _newTag];
        setValues([...values, _newTag]);
        valuesMemo.current = [...values, _newTag];
        callback?.({
          all: [...values, _newTag],
          section: [...valuesSelected, _newTag],
        });
        onChangeValue("");
      }
    }
  };
  const topContent = (): JSX.Element => {
    return (
      <div className="select-input-container flex gap-2 flex-wrap sticky top-0 z-50 w-full">
        {valuesSelected.map((tag: Tag) => (
          <Chip
            key={tag.uuid}
            style={{ backgroundColor: tag.color }}
            radius="sm"
            onClose={() => _handleDeleteInSelected(tag)}
          >
            {tag.label}
          </Chip>
        ))}
        <input
          onKeyDown={_onKeyDown}
          className="select-input caret-primary bg-transparent outline-none shadow-none appearance-none focus:appearance-none"
          placeholder={forUserEmail ? "Add collaborators..." : "Add tag..."}
          value={currentValue}
          onChange={(e) => _onChangeValue(e)}
          style={{ fontSize: "small" }}
        />
        <Divider />
      </div>
    );
  };
  const popoverContent = (tag: Tag, forUserEmail: boolean) => {
    return (
      <div className="px-1 py-2 w-full">
        {forUserEmail ? (
          <></>
        ) : (
          <>
            <input
              className="select-input caret-primary bg-transparent outline-none shadow-none appearance-none focus:appearance-none"
              placeholder={forUserEmail ? "Add collaborators..." : "Add tag..."}
              defaultValue={tag.label}
              onChange={(e) => _onChangeValueInPop(e, tag)}
              style={{ fontSize: "small" }}
            />

            <Spacer />
            <Divider />
            <Spacer />
          </>
        )}
        <Button
          className="w-full justify-start flex"
          variant="light"
          onClick={() => _handleDelete(tag)}
          size="sm"
          startContent={
            <IconUI
              name="delete"
              height={ICON_SIZE.height}
              width={ICON_SIZE.width}
            />
          }
        >
          Delete
        </Button>
        <Spacer />
        <Divider />
        <Spacer />
        <div className="flex flex-col gap-2">
          <ListColors
            handleChangeColor={_handleChangeColor}
            selected={tag}
            forUserEmail={forUserEmail}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    setValues(all);
    valuesMemo.current = all;
  }, []);

  useEffect(() => {
    setValuesSelected(section);
    valuesSelectedMemo.current = section;
  }, []);

  return (
    <>
      {isEdition ? (
        <div className="relative max-w-2xl">
          <div className="absolute right-1 top-1 z-50">
            <Button
              variant="light"
              size="sm"
              isIconOnly
              onClick={() => {
                setIsEdition(false);
              }}
            >
              <IconUI
                name="close"
                height={ICON_SIZE.height}
                width={ICON_SIZE.width}
              />
            </Button>
          </div>

          <ListboxWrapper>
            <Listbox
              topContent={topContent()}
              classNames={{
                base: "max-w-2xl",
                list: "max-h-[300px] overflow-y-scroll no-scrollbar",
              }}
              items={[...values]}
              label="Tags"
              selectionMode="none"
              variant="flat"
            >
              {(tag: Tag) => (
                <ListboxItem
                  style={{ height: "auto" }}
                  key={tag.uuid}
                  textValue={tag.label}
                >
                  <div className="flex gap-2 justify-between items-start">
                    <Chip
                      onClick={(): void => _addFromValuesToValueSelected(tag)}
                      style={{ backgroundColor: tag.color }}
                      radius="sm"
                      avatar={
                        forUserEmail ? (
                          <Avatar
                            name={tag.label}
                            src="https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png"
                          />
                        ) : (
                          <></>
                        )
                      }
                    >
                      {tag.label}
                    </Chip>
                    <Popover placement="bottom" showArrow offset={10}>
                      <PopoverTrigger>
                        <Button size="sm" variant="light" isIconOnly>
                          <IconUI
                            name="more"
                            height={ICON_SIZE.height}
                            width={ICON_SIZE.width}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[240px]">
                        {popoverContent(tag, forUserEmail)}
                      </PopoverContent>
                    </Popover>
                  </div>
                </ListboxItem>
              )}
            </Listbox>
          </ListboxWrapper>
        </div>
      ) : (
        <div className="flex gap-2 items-center w-full flex-wrap">
          <span className="ml-2">
            <IconUI
              name={forUserEmail ? "user" : "tag"}
              height={ICON_SIZE.height}
              width={ICON_SIZE.width}
            />
          </span>
          {valuesSelected.map((tag: Tag) => (
            <Chip
              key={tag.label}
              style={{ backgroundColor: tag.color }}
              radius="sm"
              onClose={(): void => _handleDeleteInSelected(tag)}
            >
              {tag.label}
            </Chip>
          ))}
          <Tooltip content={forUserEmail ? "Add a collaborator" : "Add a tag"}>
            <Button
              variant="light"
              size="sm"
              isIconOnly
              onClick={(): void => {
                setIsEdition((prevState) => !prevState);
              }}
            >
              <IconUI
                name="plus"
                height={ICON_SIZE.height}
                width={ICON_SIZE.width}
              />
            </Button>
          </Tooltip>
        </div>
      )}
    </>
  );
};

TagUI.displayName = "TagUI";
