import {
  Select,
  SelectedItemProps,
  SelectedItems,
  SelectItem,
} from "@nextui-org/react";
import { format } from "date-fns";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

import { ICON_SIZE } from "../const";
import { IconUI } from "../icon/IconUI";

export interface ICertificate {
  width?: number;
  maxWidth?: number;
}

type TLayout = "left" | "right" | "center";
type TImage = "modern";

type TItem = {
  id: string;
  name: string;
  icon:string
};
export const CONFETTIS_EFFECT = [
  {
    id: "EAnimationEffect.snow",
    name: "EAnimationEffect.snow",
  },
  {
    id: "EAnimationEffect.cannon",
    name: "EAnimationEffect.cannon",
  },
];
export const POSITIONS = [
  {
    id: "left",
    name: "left",
    icon :"layoutleft"
  },
  {
    id: "center",
    name: "center",
    icon :"layoutcenter"
  },
  {
    id: "right",
    name: "right",
    icon :"layoutright"
  },
];

export const TEMPLATES = [
  {
    id: "modern",
    name: "modern",
  },
  {
    id: "organic",
    name: "organic",
  },
];

const EditCertificate = ({
  width = 1008,
  maxWidth = 880,
}: ICertificate): JSX.Element => {
  const [cerfLayout, setCerfLayout] = useState<TLayout>("left");
  const [cerfImage, setCerfImage] = useState<TImage>("modern");

  const RATIO = maxWidth / width;
  const setPosition = (): string => {
    if (cerfLayout === "left") return "flex-start";
    if (cerfLayout === "right") return "flex-end";
    if (cerfLayout === "center") return "center";
    return "center";
  };
  const _setCerfLayout = (e: ChangeEvent): void => {
    const _target = e.target as HTMLSelectElement;
    setCerfLayout(_target.value as TLayout);
  };

  const _setCerfImage = (e: ChangeEvent): void => {
    const _target = e.target as HTMLSelectElement;
    setCerfImage(_target.value as TImage);
  };

  return (
    <>
      <div className="relative w-full">
        <div className="relative left-0">
          <div className="flex justify-between w-full gap-4">
            <Select
             variant="faded"
              items={POSITIONS as TItem[]}
              label="Position option"
              size="sm"
              selectedKeys={[cerfLayout]}
              placeholder="Select a position"
              onChange={(e) => _setCerfLayout(e)}
              labelPlacement="outside"
              classNames={{
                base: "max-w-xs",
                trigger: "h-12",
              }}
              renderValue={(items: SelectedItems<TItem>) => {
                return items.map((item: SelectedItemProps<TItem>) => (
                  <div key={item?.data?.id} className="flex items-center gap-2">
                    <IconUI
                      name={
                        item?.data?.icon
                          ? item.data.icon
                          : "left"
                      }
                      width={ICON_SIZE.width}
                      height={ICON_SIZE.height}
                    />

                    <div className="flex flex-col">
                      <span>{item?.data?.name}</span>
                    </div>
                  </div>
                ));
              }}
            >
              {(item: TItem) => (
                <SelectItem
                  key={item.id}
                  textValue={item.name}
                  variant="bordered"
                >
                  <div className="flex gap-2 items-center">
                    <IconUI
                      name={item?.icon}
                      width={ICON_SIZE.width}
                      height={ICON_SIZE.height}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{item?.name}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
            <Select
              variant="faded"
              items={TEMPLATES as TItem[]}
              label="Template option"
              size="sm"
              placeholder="Select a template"
              labelPlacement="outside"
              onChange={(e) => _setCerfImage(e)}
              selectedKeys={[cerfImage]}
              classNames={{
                base: "max-w-xs",
                trigger: "h-12",
              }}
              renderValue={(items: SelectedItems<TItem>) => {
                return items.map((item: SelectedItemProps<TItem>) => (
                  <div key={item?.data?.id} className="flex items-center gap-2">
                    <Image
                      width={40}
                      height={40}
                      src={`${process.env.DIRECTORY_IMAGES_CERTIFICATES}${item?.data?.name}_${cerfLayout}.png`}
                      alt=""
                    />
                    <div className="flex flex-col">
                      <span>{item?.data?.name}</span>
                    </div>
                  </div>
                ));
              }}
            >
              {(item: TItem) => (
                <SelectItem
                  key={item.id}
                  textValue={item.name}
                  variant="bordered"
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      width={40}
                      height={40}
                      src={`${process.env.DIRECTORY_IMAGES_CERTIFICATES}${item.name}_${cerfLayout}.png`}
                      alt=""
                    />

                    <div className="flex flex-col">
                      <span className="text-small">{item?.name}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>
        </div>
        <div
          className="relative top-5"
          style={{
            maxWidth: maxWidth + "px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              borderRadius: "16px",
              boxShadow:
                "0px 5px 20px rgba(15, 23, 31, .04), 0px 1px 6px rgba(15, 23, 31, .04), 0px 0px 1px rgba(15, 23, 31, .04)",
              backgroundColor: " #fff",
              paddingBottom: "77.2817%",
              height: 0,
            }}
          >
            <div className="relative">
              <div
                style={{
                  padding: "0 80px",
                  flexDirection: "column",
                  transformOrigin: "0 0",
                  justifyContent: "space-around",

                  margin: "0 auto",
                  width: `${width}px`,
                  height: "779px",
                  transform: `scale(${RATIO >= 1 ? 1 : RATIO})`,
                }}
              >
                <img
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    bottom: "0px",
                    height: "100%",
                    width: "100%",
                    zIndex: -1,
                  }}
                  src={`${process.env.DIRECTORY_IMAGES_CERTIFICATES}${cerfImage}_${cerfLayout}.png`}
                />

                <div
                  style={{ alignItems: setPosition() }}
                  className="flex flex-col  justify-center  w-full h-full relative"
                >
                  <div style={{ padding: "16px 0px" }}>
                    <h1
                      style={{ fontSize: 50 }}
                      className="text-black font-bold"
                    >
                      Success certification
                    </h1>
                  </div>

                  <div
                    className="flex flex-col"
                    style={{ padding: "16px 0px", marginBottom: "35px" }}
                  >
                    <p
                      style={{ fontSize: 40, color: "rgba(15, 23, 31, 0.5)" }}
                      className="text-black font-bold"
                    >
                      Awarded to
                    </p>
                    <p
                      style={{ fontSize: 40, color: "rgba(15, 23, 31, 0.5)" }}
                      className="text-black font-bold"
                    >
                      Learner -------
                    </p>
                  </div>

                  <div
                    className="flex flex-col"
                    style={{ padding: "16px 0px", marginBottom: "70px" }}
                  >
                    <p
                      style={{ fontSize: 40, color: "rgba(15, 23, 31, 0.5)" }}
                      className="text-black font-bold"
                    >
                      For the success of
                    </p>
                    <p
                      style={{ fontSize: 40, color: "rgba(15, 23, 31, 0.5)" }}
                      className="text-black font-bold"
                    >
                      course of -------
                    </p>
                  </div>

                  <div style={{ padding: "16px 0px" }}>
                    <p
                      style={{ fontSize: 30, color: "rgba(15, 23, 31, 0.5)" }}
                      className="text-black font-bold"
                    >
                      Validation date
                    </p>
                    <p
                      style={{ fontSize: 30, color: "rgba(15, 23, 31, 0.5)" }}
                      className="text-black font-bold"
                    >
                      {format(new Date(), "dd MMMM yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <span className="flex justify-center mt-2">
            <Button onClick={() => setEdit((state) => !state)} className="mt-4">
              Edit Certificate
            </Button>
          </span> */}
        </div>
      </div>
    </>
  );
};

export default EditCertificate;
