import { useState, useEffect } from "react";

function throttle(cb: () => void, ms: number) {
  let lastTime = 0;
  return () => {
    const now = Date.now();
    if (now - lastTime >= ms) {
      cb();
      lastTime = now;
    }
  };
}

export function UseInactivityTimer(ms = 1000 * 60) {
  const [idle, setIdle] = useState(false);
  const [startMonitoring, setStartMonitoring] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const handleTimeout = (): void => {
      setIdle(true);
    };

    const handleEvent = throttle(():void => {
      setIdle(false);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleTimeout, ms);
    }, 500);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvent();
      }
    };

    if (startMonitoring) {
      timeoutId = window.setTimeout(handleTimeout, ms);

      window.addEventListener("mousemove", handleEvent);
      window.addEventListener("mousedown", handleEvent);
      window.addEventListener("resize", handleEvent);
      window.addEventListener("keydown", handleEvent);
      window.addEventListener("touchstart", handleEvent);
      window.addEventListener("wheel", handleEvent);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      window.removeEventListener("mousemove", handleEvent);
      window.removeEventListener("mousedown", handleEvent);
      window.removeEventListener("resize", handleEvent);
      window.removeEventListener("keydown", handleEvent);
      window.removeEventListener("touchstart", handleEvent);
      window.removeEventListener("wheel", handleEvent);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearTimeout(timeoutId);
    };
  }, [ms, startMonitoring]);

  return { idle, setStartMonitoring };
}
