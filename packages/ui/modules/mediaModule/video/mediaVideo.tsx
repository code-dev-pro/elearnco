"use client";
import "plyr-react/plyr.css";
import { videoGetID } from "lib/utils";
import { APITypes, PlyrInstance, PlyrProps, usePlyr } from "plyr-react";
import React, { useEffect, useRef, useState } from "react";
import { GenericObject, TModuleVideo } from "schemas";

import { LAYOUT } from "../../../const";
import MediaTitle from "../mediaTitle";
import Trackers from "./components/Trackers";
import { videoOptions } from "./const";

const CustomPlyrInstance = React.forwardRef<APITypes, PlyrProps>(
  (props, ref) => {
    const { source, options = null, ...rest } = props;

    // const getDuration = () => {
    //   const { current } = ref as React.MutableRefObject<APITypes>;
    //   if (current) {
    //     return convertSecondsToTime(current.plyr.duration);
    //   }
    //   return "00:00";
    // };

    const raptorRef = usePlyr(ref, { options, source });

    useEffect(() => {
      const { current } = ref as React.MutableRefObject<APITypes>;
      if (current?.plyr?.source === null) return;
      const api = current as { plyr: PlyrInstance };
      api.plyr.on("ready", () => void 0);
      api.plyr.on("canplay", () => void 0);
      api.plyr.on("canplaythrough", () => void 0);
      api.plyr.on("statechange", () => void 0);
      api.plyr.on("ended", () => void 0);
    });

    return (
      <video
        playsInline
        ref={raptorRef as React.MutableRefObject<HTMLVideoElement>}
        className="plyr-react plyr"
        {...rest}
      />
    );
  }
);
CustomPlyrInstance.displayName = "CustomPlyrInstance";
//We can add title and description
const MediaVideo = (props: Partial<TModuleVideo>) => {
  const {
    content,
    title = "Titre",
    type = "video",
    copyright = "",
    onChange,
    description = "",
    isReadonly = false,
    markers = [],
  } = props;

  const ref = useRef<APITypes | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const provider = content?.includes("youtube");
  const [_, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const _onchange = (m: GenericObject): void => {
    onChange?.(m);
  };

  const videoSource = {
    type: type as any,
    sources: [
      {
        src: provider ? videoGetID(content as string) : (content as string),
        provider: provider ? "youtube" : ("html5" as any),
      },
    ],
  };

  const getRef = (): APITypes | null => {
    return ref.current;
  };

  useEffect(() => {
    if (containerRef.current) {
      setSize({
        width: containerRef.current.getBoundingClientRect().width,
        height: containerRef.current.getBoundingClientRect().height,
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ maxWidth: LAYOUT.MEDIA, margin: "0 auto" }}
    >
      {videoSource && (
        <CustomPlyrInstance
          ref={ref}
          options={videoOptions}
          source={videoSource}
        />
      )}

      <MediaTitle
        isReadonly={isReadonly}
        onChange={_onchange}
        title={title}
        copyright={copyright}
      />
      <Trackers
        isReadonly={isReadonly}
        data={markers}
        onChange={_onchange}
        getRef={getRef}
      />
    </div>
  );
};

export default MediaVideo;
