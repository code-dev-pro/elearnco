"use client";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import "./Wheel.css";
import { describeArc, generateColorPalette, hexToRgb } from "./utils";
import { DIM, BASE_COLOR_HEX, createDatas } from "./const";
import PaletteColors from "./colors";
import { OColor } from "schemas/global";
import { IWheel, TDataStamp } from "./interface";
import Sectors from "./sector";


export const Wheel = (props: IWheel) => {
  const { data = createDatas(), onAction } = props;
  const [angle, setAngle] = useState<number>(0);
  const [secteur, setSecteur] = useState<TDataStamp[]>(data);
  const [currentColor, setCurrentColor] = useState<{ bgColor: string }>({
    bgColor: BASE_COLOR_HEX,
  });

  const colorPalette = useMemo(
    () => generateColorPalette(hexToRgb(currentColor.bgColor), secteur.length),

    [currentColor.bgColor, secteur.length]
  );
  const colorText = useMemo((): string => {
    if (
      currentColor.bgColor === OColor["danger"] ||
      currentColor.bgColor === OColor["success"]
    )
      return "black";
    return "white";
  }, [currentColor.bgColor]);

  const handleRotate = (): void => {
    const randomIndex = Math.floor(Math.random() * secteur.length);
    const _n = secteur.length % 2 === 0 ? 2 : 1;
    //setAngle((angle) => angle + (360 / _n) * Math.floor(Math.random() * 100));

    //3 : 0 -1.5 - 3
    //4 : 0 - 1 - 2 - 4
    //5 : 0 - 1.5 - 3 - 3.5 - 4 - 4.5
    setAngle((360/secteur.length)*2* Math.floor(Math.random() * 100));
    console.log(angle + (360 / _n) * Math.floor(Math.random() * 100));
  };

  const handleSecteur = (val: TDataStamp[]): void => {
    setSecteur(val);
  };



  return (
    <>
      <div className="relative h-10">
        <PaletteColors
          onAction={(val) => setCurrentColor({ bgColor: OColor[val] })}
        />
      </div>
      <div className="flex flex-column items-center justify-center w-full">
        <div className="relative flex flex-column items-center justify-center m-10">
          <motion.div
            animate={{
              rotate: angle,
            }}
            className="relative rounded-full"
            style={{
              transition: "transform 20s curveLinear 0s",
              transform: "rotate(45deg)",
              width: DIM,
              height: DIM,
            }}
          >
            {secteur?.map((sector, index) => {
              const _n = secteur.length % 2 === 0 ? 2 : 1;
              return (
                <div
                  key={sector.id}
                  className="absolute overflow-hidden rounded-full pointer-events-none"
                  style={{
                    transform: `rotate(${
                      (360 / secteur.length) * index +
                      (-90 + 360 / secteur.length / _n)
                    }deg)`,
                    width: DIM,
                    height: DIM,
                  }}
                >
                  <svg pointerEvents="none" width={DIM} height={DIM}>
                    <path
                      fill={colorPalette[index]}
                      d={describeArc(
                        DIM / 2,
                        DIM / 2,
                        DIM / 2,
                        0,
                        360 / secteur.length
                      )}
                    />
                  </svg>

                  <div
                    className="absolute flex justify-left items-center flex-wrap"
                    style={{
                      transformOrigin: "left top",
                      top: DIM / 2,
                      left: DIM / 2,
                      width: DIM / 2,
                      height: "30%",
                      background: "transparent",
                      transform: `rotate(${
                        -90 + 360 / secteur.length / 2
                      }deg) translateY(-50%)`,
                      padding: "0 2% 0 10%",
                    }}
                  >
                    <p
                      style={{ width: DIM / 2 - 60, color: colorText }}
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
            <p className="text-default">+</p>
          </div>
        </div>
      </div>
      <div className="flex gap-10 items-center justify-center mt-2">
        <Button onClick={handleRotate}>Lancer la roue</Button>
      </div>
      <Sectors
        dataStamp={secteur}
        mode="edition"
        updateSector={handleSecteur}
      />
    </>
  );
};

export default Wheel;
