import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { TCanvasConfettiInstance } from "react-canvas-confetti/dist/types/";

import { canvasStyles } from "./const";
import { EAnimationEffect, IRef, Timeout } from "./types";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getAnimationSettings(
  originXA: number,
  originXB: number
): confetti.Options {
  return {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    particleCount: 150,
    origin: {
      x: randomInRange(originXA, originXB),
      y: randomInRange(0, 0.99) - 0.2,
    },
  };
}
function getAnimationSnow(
  angle: number,
  originX: number,
  color: string
): confetti.Options {
  return {
    particleCount: 1,
    startVelocity: 0,
    angle: angle,
    gravity: 0.5,
    origin: {
      x: randomInRange(0, 0.99) * originX,
      y: randomInRange(0, 0.99) * 0.999 - 0.2,
    },
    shapes: ["circle"],
    scalar: randomInRange(0.4, 1),
    colors: [color],
  };
}
function getAnimationFire(
  particleRatio: number,
  opts: confetti.Options
): confetti.Options {
  return {
    ...opts,
    origin: { y: 0.7 },
    particleCount: Math.floor(200 * particleRatio),
  };
}
function getAnimationCanon(angle: number, originX: number): confetti.Options {
  return {
    particleCount: 100,
    angle,
    spread: 55,
    origin: { x: originX },
  };
}
//TODO: remove intervall and use requestAnimationFrame for performance
const Fireworks = React.forwardRef(
  (props: any, ref: React.Ref<IRef> | null): JSX.Element => {
    const refAnimationInstance = useRef<TCanvasConfettiInstance | null>(null);

    const [intervalId, setIntervalId] = useState<
      string | number | Timeout | undefined
    >(undefined);
    const refEffect = useRef<EAnimationEffect>(EAnimationEffect.snow);

    useImperativeHandle(
      ref,
      () => {
        return {
          startAnimation: (type: EAnimationEffect): void => {
            refEffect.current = type;
            startAnimation();
          },
          stopAnimation: (): void => {
            stopAnimation();
          },
        };
      },

      []
    );

    const onInit = ({ confetti }: { confetti: TCanvasConfettiInstance }) => {
      refAnimationInstance.current = confetti;
    };

    const nextTickAnimation = useCallback((): void => {
      if (refAnimationInstance.current) {
        if (refEffect.current === EAnimationEffect.fireworks) {
          refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
          refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
        } else if (refEffect.current === EAnimationEffect.snow) {
          refAnimationInstance.current(getAnimationSnow(60, 0.2, "#4e1b8d"));
          refAnimationInstance.current(getAnimationSnow(120, 1, "#bada55"));
          refAnimationInstance.current(getAnimationSnow(120, 0.8, "#16ad67"));
          refAnimationInstance.current(getAnimationSnow(90, 0.5, "#ff00ff"));
        } else if (refEffect.current === EAnimationEffect.cannon) {
          refAnimationInstance.current(getAnimationCanon(60, 0));
          refAnimationInstance.current(getAnimationCanon(120, 1));
        } else {
          refAnimationInstance.current(
            getAnimationFire(0.2, {
              spread: 60,
            })
          );
        }
      }
    }, []);

    const startAnimation = useCallback((): void => {
      if (!intervalId) {
        const DELAY = refEffect.current === EAnimationEffect.snow ? 50 : 400;
        setIntervalId(setInterval(nextTickAnimation, DELAY));
      }
    }, [intervalId, nextTickAnimation]);

    const pauseAnimation = useCallback((): void => {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }, [intervalId]);

    const stopAnimation = useCallback((): void => {
      clearInterval(intervalId);
      setIntervalId(undefined);
      refAnimationInstance?.current?.reset?.();
    }, [intervalId]);

    useEffect(() => {
      return (): void => {
        clearInterval(intervalId);
      };
    }, [intervalId]);

    return <ReactCanvasConfetti onInit={onInit} style={canvasStyles} />;
  }
);

Fireworks.displayName="Fireworks"

export default Fireworks;
