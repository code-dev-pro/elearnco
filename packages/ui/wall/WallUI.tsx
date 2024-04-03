"use client";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { IconAvatarUI } from "../icon/IconAvartarUI";
import { IProps } from "./interface";
import { AVATARS } from "./mock";
const springConfig = { stiffness: 100, damping: 5 };
export const WallUI = (IProps: IProps) => {
  const { className, width = "50%" } = IProps;
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const x = useMotionValue(0);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
 
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event: React.MouseEvent): void => {
    const halfWidth = 50;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className={`relative h-screen ${className}`} style={{ width }}>
      {AVATARS.map((avatar) => (
        <div
          className="absolute"
          key={avatar.id}
          onMouseEnter={(): void => setHoveredIndex(avatar.id)}
          onMouseLeave={(): void => setHoveredIndex(null)}
          style={{
            rotate: `${avatar.rotation}deg`,

            left: avatar.x + "%",
            top: avatar.y + "%",
          }}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === avatar.id && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: -50,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  zIndex: 80,
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="font-bold text-white relative z-30 text-base">
                  {avatar.name}
                </div>
                <div className="text-white text-xs">{avatar.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            onMouseMove={handleMouseMove}
            className="rounded-full absolute overflow-hidden cursor-pointer"
            style={{
              rotate: `${avatar.rotation}deg`,
              zIndex: 100,
              backgroundColor: avatar.bgColor,
            }}
          >
            <IconAvatarUI
              style={{ transform: "scale(0.9)" }}
              name={avatar.src}
              width={100}
              height={100}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
