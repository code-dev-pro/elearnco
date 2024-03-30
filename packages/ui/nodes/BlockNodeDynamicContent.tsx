import dynamic from "next/dynamic";
import React from "react";

import { LoadingSpinnerUI } from "../loading";

/** WRITE MODULE */
export const DynamicWriterModule = dynamic(
  () => import("../modules/writeModule"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);
/** DRAWING MODULE */
// export const DynamicDrawingModule = dynamic(
//   () => import("../modules/drawingModule"),
//   {
//     loading: () => <LoadingSpinnerUI />,
//   }
// );
/** WHEEL MODULE */
export const DynamicWheelModule = dynamic(
  () => import("../modules/wheelModule"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);
/** QCM */
export const DynamicQCModule = dynamic(
  () => import("../modules/activitiesModule/qc"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);

/** IMAGE */
export const DynamicMediaModule = dynamic(
  () => import("../modules/mediaModule"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);
