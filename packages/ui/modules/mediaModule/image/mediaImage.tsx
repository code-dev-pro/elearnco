import { Image } from "@nextui-org/react";
import React, { SyntheticEvent, useState } from "react";
import { GenericObject, TModuleImage } from "schemas";
import { LAYOUT } from "../../../const";
import DrawinEditor from "../../../editor/drawing";
import MediaTitle from "../mediaTitle";

const MediaImage = (props: TModuleImage) => {
  const {
    content,
    title = "title",
    copyright = "copyright",
    onChange,
    isReadonly,
  } = props;

  const [currentSize, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const onLoad = (event: SyntheticEvent<HTMLImageElement, Event>): void => {
    const _target = event.target as HTMLImageElement;

    if (_target) {
      setSize({ width: _target.naturalWidth, height: _target.naturalHeight });
    }
  };

  const _onchange = (m: GenericObject): void => {
    onChange?.(m);
  };

  return (
    <div
      className="select-none relative z-10"
      style={{ maxWidth: LAYOUT.MEDIA }}
    >
      <DrawinEditor size={currentSize} />
      <Image
        removeWrapper
        style={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          margin: "0 auto",
        }}
        draggable={false}
        width={LAYOUT.MEDIA}
        src={content}
        alt={title}
        onLoad={onLoad}
        className="z-20"
      />
      <MediaTitle
        isReadonly={isReadonly}
        onChange={_onchange}
        title={title}
        copyright={copyright}
      />
    </div>
  );
};

export default MediaImage;
