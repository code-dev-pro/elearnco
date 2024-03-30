"use client";
import "./Wheel.scss";

import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { randomDraw } from "lib";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { OColor } from "schemas/global";
import PaletteColors from "./components/Colors";
import Sectors from "./components/Sector";
import { ANGLE,BASE_COLOR_HEX, DIM, MAX, MIN } from "./const";
import { IWheel, OColorType, TDataStamp } from "./interface";
import {
  createDatas,
  describeArc,
  generateColorPalette,
  getKeyByValue,
  hexToRgb,
} from "./utils";

export const Wheel = (props: IWheel) => {
  const {
    data = createDatas(),
    onChange,
    isReadOnly = false,
    color = OColor[BASE_COLOR_HEX],
    size = DIM
  } = props;
  
  //States
  const [angle, setAngle] = useState<number>(0);
  const [sectors, setsectors] = useState<TDataStamp[]>(data);
  const [currentColor, setCurrentColor] = useState<{ bgColor: string }>({
    bgColor: color,
  });

  //Refs
  const refIndex = useRef<number>(1);

  //Methods
  const colorPalette = useMemo(
    () => generateColorPalette(hexToRgb(currentColor.bgColor), sectors.length),

    [currentColor.bgColor, sectors.length]
  );
  const colorText = useMemo((): string => {
    if (
      currentColor.bgColor === OColor["danger"] ||
      currentColor.bgColor === OColor["success"]
    )
      return "black";
    return "white";
  }, [currentColor.bgColor]);

  const _setColor = (val: any): void => {
    setCurrentColor({ bgColor: OColor[val as keyof OColorType] });
    onChange({ data: sectors, color: OColor[val as keyof OColorType] });
  };

  const _handlesectors = (val: TDataStamp[]): void => {
    refIndex.current = 1;
    setsectors(val);
    setAngle(ANGLE / val.length);
    onChange({ data: val, color: currentColor.bgColor });
  };

  const _handleRotate = (): void => {
    const sectorLength = sectors.length;
    const anglePerSector = ANGLE / sectorLength;
    const maxRandomDeviation = randomDraw(MIN, MAX);
    const refAngle = angle - ANGLE / sectorLength;
    const randomAngle =
      refAngle * maxRandomDeviation - angle * (maxRandomDeviation - 1);

    setAngle(randomAngle);
    const nbrWheel = Math.abs(randomAngle / anglePerSector) + 1;
    const sectorIndex = nbrWheel % sectorLength;
    refIndex.current = sectorIndex + 1;
  };

  const _rotateAngle = (index: number): number => {
    const sectorLength = sectors.length;
    const anglePerSector = ANGLE / sectorLength;
    const initialOffset = 90;

    return (
      anglePerSector * index -
      (anglePerSector - initialOffset) -
      anglePerSector / 2
    );
  };

  useEffect(() => {
    if (data.length) {
      setsectors(data);
      setAngle(ANGLE / data.length);
    }
  }, []);

  return (
    <>
      <div className="relative h-10">
        {isReadOnly ? (
          <></>
        ) : (
          <PaletteColors
            defaultColor={getKeyByValue(OColor, currentColor.bgColor)}
            onAction={(val): void => _setColor(val)}
          />
        )}
      </div>
      <div className="flex flex-column items-center justify-center w-full">
        <div className="relative flex flex-column items-center justify-center m-10">
          <motion.div
            animate={{
              rotate: angle,
            }}
            onAnimationComplete={(): void => {
              const sectorIndex = refIndex.current - 1;
              const selectedSector = sectors[sectorIndex];
              
            }}
            initial={false}
            className="relative rounded-full"
            style={{
              transition: "transform 20s curveLinear 0s",
              width: size,
              height: size,
            }}
          >
            {sectors?.map((sector, index) => {
              return (
                <div
                  key={sector.id}
                  className="absolute overflow-hidden rounded-full pointer-events-none"
                  style={{
                    transform: `rotate(${_rotateAngle(index)}deg)`,
                    width: size,
                    height: size,
                  }}
                >
                  {/* ARC */}
                  <svg pointerEvents="none" width={DIM} height={DIM}>
                    <path
                      fill={colorPalette[index]}
                      d={describeArc(
                        size / 2,
                        size / 2,
                        size / 2,
                        0,
                        ANGLE / sectors.length
                      )}
                    />
                  </svg>

                  <div
                    className="absolute flex justify-left items-center flex-wrap"
                    style={{
                      transformOrigin: "left top",
                      top: size / 2,
                      left: size / 2,
                      width: size / 2,
                      height: "30%",
                      background: "transparent",
                      transform: `rotate(${
                        -90 + 180 / sectors.length
                      }deg) translateY(-50%)`,
                      padding: "0 2% 0 11%",
                    }}
                  >
                    <p
                      style={{ width: size / 2 - 60, color: colorText }}
                      className="line-clamp-3 break-all"
                    >
                      {sector.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
          <div className="wheel_center" />
          <div className="absolute flex justify-center item-center rounded-full w-14 h-14 min-h-14 min-w-14 bg-white">
            <p className="flex items-center text-default">+</p>
          </div>
        </div>
      </div>

      <div className="flex gap-10 items-center justify-center mt-2">
        <Button onClick={_handleRotate}>Spin the wheel</Button>
      </div>
      {!isReadOnly && (
        <Sectors dataStamp={sectors} updateSector={_handlesectors} />
      )}
    </>
  );
};

export default Wheel;
