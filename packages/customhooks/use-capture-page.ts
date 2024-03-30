import { useCallback, useState } from "react";
import html2canvas from "html2canvas";

const useCapturePage = () => {
  const [capturedCanvas, setCapturedCanvas] =
    useState<HTMLCanvasElement | null>(null);

  const capturePage = useCallback(async (targetRef) => {
    if (targetRef) {
      try {
        const canvas = await html2canvas(targetRef, {
          allowTaint: true,
          logging: true,
          useCORS: true,
          ignoreElements: (elt) => {
            return false;
          },
        });
       return canvas
       // setCapturedCanvas(canvas);
      } catch (error) {
        console.error("ERROR PAGE CAPTURE :", error);
      }
    }
  }, []);

  return { capturePage, capturedCanvas };
};

export default useCapturePage;
