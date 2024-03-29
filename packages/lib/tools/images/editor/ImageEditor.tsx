import "react-mobile-cropper/dist/style.css";

import { Button } from "@nextui-org/react";
import React, { useEffect,useRef, useState } from "react";
import { Cropper,CropperRef } from "react-mobile-cropper";
import { GenericObject, IModal } from "schemas";
import { useDisabledStore } from "store";


const ImageEditor = (props: IModal) => {
  const { onClose, action, ...data } = props;
  const { onBeginDisabled, onStopDisabled, isDisabled } = useDisabledStore();
  const { callback, src } =data as GenericObject  ;
  //States
  const [image, setImage] = useState(src);
  // Refs
  const refCrop = useRef<CropperRef>(null);
  //Methods
  const _onReady = (): void => {
    onStopDisabled();
  };
  const _onSave = async (): Promise<void> => {
    const base64Data = refCrop?.current?.getCanvas()?.toDataURL();
    const url = base64Data;
    const _callback = callback as (url:string)=> void
    _callback?.(url as string);
  };

  useEffect(() => {
    setImage(src);
    return () => {
      onBeginDisabled();
    };
  }, [src]);

  return (
    <>
      <Cropper
        ref={refCrop}
        stencilProps={{
          aspectRatio: 16 / 9,
        }}
        src={image}
        crossOrigin="anonymous"
        onReady={_onReady}
        className="react-mobile-cropper"
      />
      <div className="flex justify-end gap-2">
        <Button color="danger" variant="flat" onPress={onClose}>
          Close
        </Button>
        <Button
          isDisabled={isDisabled}
          isLoading={false}
          type="submit"
          color="primary"
          onClick={_onSave}
        >
          Valid
        </Button>
      </div>
    </>
  );
};

export default ImageEditor;
