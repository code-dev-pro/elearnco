//import { useCollaboration, useYMapItem } from "collaboration";
import React from "react";

import { BannerUI } from "./BannerUI";
export const BannerGeneric = () => {
  return <BannerUI />;
};

export const BannerWithCollaboration = () => {
  /* const { doc } = useCollaboration() ;
  const [banner, setBanner] = useYMapItem<string>(
    doc?.getMap("page"),
    "banner"
  ); */
  return <></>;
  //return <BannerUI setBanner={setBanner} bannerT={banner} isHidden={false} />;
};
