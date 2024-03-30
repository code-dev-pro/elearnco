import { useEffect } from "react";

import { useAwarenessStateField } from "../hooks/useAwareness";
import { AwarenessState } from "../types";

export const CollaborationMouseUpdater = () => {
  const [mouses, mouse, setMouse] =
    useAwarenessStateField<AwarenessState["mouse"]>("mouse");

  const current: NonNullable<AwarenessState["mouse"]> = {
    x: 0,
    y: 0,
    style: "auto",
    clicking: false,
    grabbing: false,
  };

  function update() {
    setMouse(current);
  }

  function handleMousemove(e: MouseEvent): void {
    current.x = e.x;
    current.y = e.y;

    if (e.target instanceof HTMLElement) {
      const computed = window.getComputedStyle(e.target)["cursor"];
      //console.log(computed)
      current.style = computed;

      if (e.target.isContentEditable) {
        current.style = "text";
      }
    }

    update();
  }

  function handleMousedown(): void {
    if (current.style === "text") return;

    current.style === "grab"
      ? (current.grabbing = true)
      : (current.clicking = true);
    update();
  }

  function handleMouseup(): void {
    current.clicking = false;
    current.grabbing = false;
    update();
  }
  useEffect(() => {
    if (typeof window == "undefined") return;

    document.addEventListener("mousemove", handleMousemove);
    document.addEventListener("mousedown", handleMousedown);
    document.addEventListener("mouseup", handleMouseup);
    document.body.style.cursor = "none";
  }, [mouse, mouses]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
      document.removeEventListener("mousemove", handleMousemove);
      document.removeEventListener("mousedown", handleMousedown);
      document.removeEventListener("mouseup", handleMouseup);
    };
  }, []);

  return <></>;
};
