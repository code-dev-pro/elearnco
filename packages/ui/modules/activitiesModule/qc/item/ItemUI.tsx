"use client";
import "./item.scss";

import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { ActivityBlockType, TextBlockType } from "schemas";

import { ICON_SIZE } from "../../../../const";
import { IconUI } from "../../../../icon/IconUI";
import WriterEditor from "../../../writeModule";
import { IItem, TExItem } from "../types/types";
import CountUI from "./CountUI";

const Marker = () => {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12.3339 2.45874C11.7605 2.45874 11.2089 2.51896 10.6804 2.61165C10.2724 2.6832 9.99969 3.07194 10.0712 3.47993C10.1428 3.88792 10.5315 4.16065 10.9395 4.0891C11.4024 4.00792 11.8655 3.95874 12.3339 3.95874C12.8023 3.95874 13.2654 4.00792 13.7283 4.0891C14.1363 4.16065 14.525 3.88792 14.5966 3.47993C14.6681 3.07194 14.3954 2.6832 13.9874 2.61165C13.4589 2.51896 12.9073 2.45874 12.3339 2.45874Z"></path>
      <path d="M21.286 8.78846C21.1453 8.39886 20.7154 8.19708 20.3258 8.33775C19.9362 8.47843 19.7345 8.9083 19.8751 9.29789C20.1895 10.1685 20.3679 11.0994 20.3679 12.0713C20.3679 12.4855 20.7037 12.8213 21.1179 12.8213C21.5321 12.8213 21.8679 12.4855 21.8679 12.0713C21.8679 10.9137 21.6551 9.81084 21.286 8.78846Z"></path>
      <path d="M16.0743 4.02439C16.2831 3.66664 16.7423 3.54586 17.1001 3.75464C18.0629 4.31648 18.9233 5.04001 19.6366 5.89658C19.9017 6.21488 19.8585 6.68779 19.5402 6.95285C19.2219 7.21791 18.749 7.17476 18.4839 6.85646C17.8844 6.13647 17.1589 5.52569 16.3441 5.05017C15.9863 4.8414 15.8655 4.38214 16.0743 4.02439Z"></path>
      <path d="M8.32295 5.05017C8.6807 4.8414 8.80148 4.38214 8.5927 4.02439C8.38393 3.66664 7.92467 3.54586 7.56692 3.75464C6.60385 4.31665 5.74462 5.04017 5.03075 5.89616C4.76545 6.21427 4.80827 6.68721 5.12637 6.9525C5.44448 7.2178 5.91742 7.17498 6.18271 6.85688C6.78365 6.13631 7.5084 5.52552 8.32295 5.05017Z"></path>
      <path d="M4.3414 8.33784C4.73094 8.47864 4.93259 8.90858 4.79178 9.29812C4.47751 10.1676 4.2991 11.0983 4.2991 12.0713C4.2991 12.4855 3.96331 12.8213 3.5491 12.8213C3.13488 12.8213 2.7991 12.4855 2.7991 12.0713C2.7991 10.9128 3.01183 9.80986 3.38111 8.78822C3.52191 8.39868 3.95185 8.19703 4.3414 8.33784Z"></path>
      <path d="M8.32297 19.0925C7.96528 18.8836 7.50598 19.0042 7.29709 19.3619C7.08819 19.7196 7.2088 20.1789 7.56648 20.3877C8.51325 20.9407 9.56227 21.3324 10.6791 21.5297C11.087 21.6018 11.4761 21.3295 11.5482 20.9216C11.6203 20.5138 11.348 20.1247 10.9401 20.0526C10.0005 19.8866 9.11896 19.5574 8.32297 19.0925Z"></path>
      <path d="M3.83154 14.394C4.2211 14.2532 4.65101 14.4549 4.79177 14.8445C5.1174 15.7456 5.58768 16.5707 6.18304 17.2863C6.44795 17.6047 6.40458 18.0776 6.08615 18.3425C5.76773 18.6075 5.29484 18.5641 5.02993 18.2457C4.32016 17.3925 3.76414 16.4144 3.38104 15.3542C3.24028 14.9646 3.44197 14.5347 3.83154 14.394Z"></path>
      <path d="M17.1006 20.3879C17.4584 20.1792 17.5793 19.72 17.3705 19.3622C17.1618 19.0044 16.7026 18.8836 16.3448 19.0923C15.5475 19.5574 14.6667 19.8866 13.7273 20.0526C13.3194 20.1247 13.0472 20.5138 13.1193 20.9217C13.1913 21.3295 13.5804 21.6018 13.9883 21.5297C15.1054 21.3323 16.1533 20.9406 17.1006 20.3879Z"></path>
      <path d="M20.8358 14.394C21.2253 14.5347 21.427 14.9646 21.2863 15.3542C20.9032 16.4144 20.3472 17.3925 19.6374 18.2457C19.3725 18.5641 18.8996 18.6075 18.5812 18.3425C18.2627 18.0776 18.2194 17.6047 18.4843 17.2863C19.0796 16.5707 19.5499 15.7456 19.8755 14.8445C20.0163 14.4549 20.4462 14.2532 20.8358 14.394Z"></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.3864 9.07172C16.6792 9.36461 16.6792 9.83949 16.3864 10.1324L11.6169 14.9018C11.587 14.95 11.5512 14.9956 11.5093 15.0374C11.2164 15.3303 10.7416 15.3303 10.4487 15.0374L8.28076 12.8695C7.98787 12.5766 7.98787 12.1018 8.28076 11.8089C8.57366 11.516 9.04853 11.516 9.34142 11.8089L10.965 13.4324L15.3257 9.07172C15.6186 8.77883 16.0935 8.77883 16.3864 9.07172Z"
      />
    </svg>
  );
};

export const ItemUI = (props: IItem & TExItem) => {
  const {
    editable,
    content,
    id,
    deleteItem,
    type,
    updateItem,
    updateRandom,
    isGood,
  } = props;

  // STATES & HOOKS --------------------------------
  const [isSelected, setIsSelected] = useState<boolean>(isGood);

  // Methods --------------------------------
  const _toogleisSelected = (): void => {
    updateRandom?.(id, !isSelected);
    setIsSelected((val) => !val);
  };

  const _onChange = (data: {content:string,type:TextBlockType}): void => {
   

    updateItem?.(id, data);
  };

  // RENDER --------------------------------
  return (
    <div className="flex items-center mt-2 mb-2">
      <input id={id} className="input" type="checkbox" />
      <div
        style={{ borderRadius: 16 }}
        className="multiple-choice-radio-item flex items-center bg-default w-full  relative rounded-2xl"
      >
        <CountUI type={type} isSelected={isSelected} />
        <span className="answer-marker">
          <WriterEditor
            content={content}
            editable={editable}
            containerType={ActivityBlockType.MULTIPLE_CHOICE}
            type={TextBlockType.PARAGRAH}
            onChange={_onChange} 
            uuid=""        />
        </span>
        <label htmlFor={id} className="label-marker">
          <span hidden className="visually-hidden">
            Toggle correct
          </span>
          <span
            onClick={_toogleisSelected}
            className={`icon-marker off ${!isSelected  ? "isSelected" : ""}`}
          >
            <Marker />
          </span>
          <span
            onClick={_toogleisSelected}
            className={`icon-marker on ${isSelected ? "isSelected" : ""}`}
          >
            <svg viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12ZM16.0216 10.1361C16.3144 9.84321 16.3144 9.36834 16.0216 9.07544C15.7287 8.78255 15.2538 8.78255 14.9609 9.07544L10.6002 13.4362L8.97662 11.8126C8.68373 11.5197 8.20885 11.5197 7.91596 11.8126C7.62307 12.1055 7.62307 12.5804 7.91596 12.8732L10.0839 15.0411C10.3768 15.334 10.8516 15.334 11.1445 15.0411C11.1863 14.9993 11.2222 14.9538 11.2521 14.9056L16.0216 10.1361Z"
              />
            </svg>
          </span>
        </label>
      </div>
      {editable && (
        <Button
          startContent={
            <IconUI
              name="delete"
              width={ICON_SIZE.width}
              height={ICON_SIZE.height}
            />
          }
          color="danger"
          className="flex ml-2"
          isIconOnly
          onClick={(): void => deleteItem?.(id)}
        />
      )}
    </div>
  );
};

export default ItemUI;
