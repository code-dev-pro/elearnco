"use client";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { nanoid, removeObjectById } from "lib";
import React, { ChangeEvent, useEffect, useState } from "react";

import { IconUI } from "../../../icon/IconUI";
import { SwitchUI } from "../../../switch/SwitchUI";
import IAModule from "../../iaModule";
import { PROPS_BUTTON } from "../../wheelModule/const";
import { dataList } from "./const";
import ItemUI from "./item/ItemUI";
import { IItem, IProps, TListItem } from "./types/types";
import { TextBlockType } from "schemas";

//TODO FEEDBACKS
export const QcUI = (props: IProps) => {
  const { isReadOnly, data, onChange } = props;

  // HOOKS & STATES
  const [collectionItems, setCollectionItems] = useState<IItem[]>(data?.data);
  const [value, setValue] = useState<TListItem[]>([data?.type]);
  const [isRandom, setRandom] = useState<boolean>(data?.isRandom);

  // Methods
  const _deleteItem = (id: string): void => {
    const newCollection = removeObjectById(collectionItems, id);
    onChange({ data: newCollection, type: value[0], isRandom: isRandom });
    setCollectionItems(newCollection);
  };

  const _upddateGood = (id: string, isGood: boolean): void => {
    const items = collectionItems.map((item) =>
      item.id === id ? { ...item, ...{ isGood: isGood } } : item
    );
    onChange({ data: items, type: value[0], isRandom: isRandom });
    setCollectionItems(items);
  };

  const _updateItem = (
    id: string,
    updatedItem: { content: string; type: TextBlockType }
  ): void => {
    const items = collectionItems.map((item) =>
      item.id === id ? { ...item, ...{ content: updatedItem } } : item
    );
    onChange({ data: items, type: value[0], isRandom: isRandom });
    setCollectionItems(items);
  };

  const _addItem = (): void => {
    const newCollection = [
      ...collectionItems,
      {
        id: nanoid(7),
        content: "",
        editable: true,
        isGood: false,
      },
    ];
    onChange({ data: newCollection, type: value[0], isRandom: isRandom });
    setCollectionItems(newCollection);
  };

  const generateFromIA = (m: string): void => {
    const chaine: string = m.trim();
    const wordsCollection: string[] = chaine.split("@");

    const newCollection = wordsCollection.map((word: string) => ({
      id: nanoid(7),
      content: word,
      editable: true,
      isGood: false,
    }));

    onChange({ data: newCollection, type: value[0], isRandom: isRandom });
    setCollectionItems(newCollection);
  };

  const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const target = e.target as HTMLSelectElement;
    onChange({
      data: collectionItems,
      type: target.value as TListItem,
      isRandom: isRandom,
    });
    setValue([target.value as TListItem]);
  };

  useEffect(() => {
    setCollectionItems(data?.data);
    setRandom(data.isRandom);
    setValue([data.type]);
  }, [data]);

  return (
    <div>
      {!isReadOnly && (
        <div className="w-full flex justify-end gap-2">
          <Select
            label="Select type list"
            className="max-w-xs"
            size="sm"
            defaultSelectedKeys={value}
            selectedKeys={value}
            onChange={handleSelectionChange}
            popoverProps={{
              shouldFlip: true,
              shouldCloseOnBlur: true,
              shouldBlockScroll: true,
            }}
          >
            {dataList.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
          <SwitchUI
            content="Random"
            initialState={isRandom}
            setHandler={(val) => {
              setRandom(val);
              onChange({
                data: collectionItems,
                type: value[0],
                isRandom: val,
              });
            }}
          />
        </div>
      )}
      <div style={{ counterReset: "list-number" }}>
        {collectionItems?.map((item: IItem) => {
          return (
            <ItemUI
              id={item.id}
              key={item.id}
              editable={!isReadOnly}
              content={item.content.content}
              isGood={item.isGood}
              updateItem={_updateItem}
              deleteItem={_deleteItem}
              updateRandom={_upddateGood}
              type={value[0]}
            />
          );
        })}
      </div>
      {!isReadOnly && (
        <div className="flex justify-between w-full">
          <p className="text-tiny text-default-400">
            AI can make mistakes. Consider checking important information.
          </p>
          <div className="flex gap-2 w-full justify-end py-2">
            <Button
              startContent={<IconUI name="plus" {...PROPS_BUTTON} />}
              color="primary"
              variant="solid"
              onClick={_addItem}
              size="sm"
            >
              Add item
            </Button>
            <IAModule endIA={(m) => generateFromIA(m)} />
          </div>
        </div>
      )}
    </div>
  );
};
export default QcUI;
