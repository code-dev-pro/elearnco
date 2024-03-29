"use client";
import { checkHttps } from "lib/utils";
import { useRouter } from "next13-progressbar";
import React, { useCallback } from "react";
import { CompleteCourse, EActionsCourseInFooterCard, ERoutes } from "schemas";

import { useGlobalModalStore } from "../../store";
import { CardContentUI } from "./CardContentUI";

export const CardUI = (props: CompleteCourse) => {
  const { image, id = "id" } = props;

  // States & hooks
  const router = useRouter();
  const modalStore = useGlobalModalStore();

  // Methods
  const _actionHandler = useCallback(
    (action: string): void => {
      if (action === (EActionsCourseInFooterCard.EDIT as string)) {
        router.push(`/${ERoutes.EDITOR}/${id}?page=${1}`);
        return;
      }
      if (action === (EActionsCourseInFooterCard.PREVIEW as string)) {
        router.push(`/${ERoutes.PREVIEW}/${id}?page=${1}`);
        return;
      }

      modalStore.onOpen(action, { ...props });
    },
    [props]
  );
  const _setControlBanner = (): string => {
    if (image === "") return "";
    if (checkHttps(image)) return image;
    return `/patterns/${image}.svg`;
  };

  const BANNER_COURSE = _setControlBanner();

  return (
    <CardContentUI
      banner={BANNER_COURSE}
      actionHandler={_actionHandler}
      {...props}
    />
  );
};
