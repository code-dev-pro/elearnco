"use client";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useUploadFile } from "customhooks";
import dynamic from "next/dynamic";
import React, {
  ChangeEvent,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GenericObject, TModuleImage, TModuleVideo } from "schemas";
import { useGlobalModalStore } from "store";

import ButtonUI from "../../button/ButtonUI";

import { ICON_SIZE } from "../../const";
import { LoadingSpinnerUI } from "../../loading";

const DynamicMediaFomService = dynamic(
  () => import("ui/media/fromservice/LibraryUI"),
  {
    loading: () => <LoadingSpinnerUI />,
  }
);

const DynamicMediaImage = dynamic(() => import("./image/mediaImage"), {
  loading: () => <LoadingSpinnerUI />,
});

const DynamicMediaVideo = dynamic(() => import("./video/mediaVideo"), {
  loading: () => <LoadingSpinnerUI />,
});

export const MediaModule = (
  props: (TModuleImage | TModuleVideo) & { uuid: string; id: string }
) => {
  const {
    onChange,
    content,
    type,
    uuid,
    id,
    title,
    copyright,
    description,
    markers,
  } = props;

  /** States */
  const [media, setMedia] = useState<string>(content);
  const [error, setError] = useState<GenericObject>({ message: "" });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isImage = type === "image";
  const isVideo = type === "video";
  const isAudio = type === "audio";
  const filetype = isImage
    ? "image/jpg, image/jpeg, image/png"
    : isVideo
    ? "video/mp4"
    : "audio/mp3,audio/mpeg";

  const { onOpen } = useGlobalModalStore();

  /** Refs */
  const refTimeout = useRef<NodeJS.Timeout>();
  const ref = useRef<HTMLDivElement>(null);

  /** Methods */
  const { handleChange, fileData } = useUploadFile({
    handleError(props: any) {
      setError(props?.error);
    },
    multiple: false,
    fileType: isImage
      ? ["image/jpg", "image/jpeg", "image/png"]
      : isVideo
      ? ["video/mp4"]
      : ["audio/mp3", "audio/mpeg"],
    maxfileSize: isImage ? 1500 : 5000, //in kb,
  });

  const _callback = (data: GenericObject): void => {
    const _onChange = onChange as (data: GenericObject) => void;
    _onChange?.(data);
    setMedia(data.content);
    setIsOpen(false);
  };

  const _onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    refTimeout.current = setTimeout(() => {
      if (refTimeout.current) clearTimeout(refTimeout.current);
      const _target = e.target as HTMLInputElement;
      if (_target)
        _callback?.({ content: _target.value, description: "", copyright: "" });
    }, 500);
  };
  const _clickHandler = (): void => {
    onOpen("Edit image", { src: media, callback: _callback });
  };

  const _onKeyUp: KeyboardEventHandler<HTMLInputElement> = (event): void => {
    if (event.key === "Enter") {
      setIsOpen(false);
    }
  };
  const _setMenuTools = (): JSX.Element => {
    return (
      <div
        style={{ zIndex: 99, right: 0 }}
        className="relative top-0  z-50 p-4"
      >
        <ButtonGroup size="sm" radius="full">
          {type === "image" ? (
            <ButtonUI
              tooltip={{
                content: "Add hotspot or draw",
                placement: "top",
              }}
              button={{
                handleClick: _clickHandler,
                isIconOnly: true,
                label: "Add hotspot",
                withTooltip: true,
                className: "",
                isDisabled: false,
              }}
              icon={{ iconSize: ICON_SIZE.width, iconName: "location" }}
            />
          ) : (
            <ButtonUI
              tooltip={{
                content: "Add time marker",
                placement: "top",
              }}
              button={{
                handleClick: _clickHandler,
                isIconOnly: true,
                label: "Add time marker",
                withTooltip: true,
                className: "",
                isDisabled: false,
              }}
              icon={{ iconSize: ICON_SIZE.width, iconName: "clockaddplus" }}
            />
          )}
          <ButtonUI
            tooltip={{
              content: "Edit",
              placement: "top",
            }}
            button={{
              handleClick: _clickHandler,
              isIconOnly: true,
              label: "Edit",
              withTooltip: true,
              className: "",
              isDisabled: false,
            }}
            icon={{ iconSize: ICON_SIZE.width, iconName: "imageedit" }}
          />
        </ButtonGroup>
      </div>
    );
  };

  const _setMedia = useMemo(() => {
    if (!media) return <></>;
    if (isImage)
      return (
        <div className="relative flex flex-col items-center w-full">
          {_setMenuTools()}
          <div style={{ marginTop: -75 }}>
            <DynamicMediaImage
              content={media}
              title={title}
              description={description}
              copyright={copyright}
              onChange={onChange}
              isReadonly={false}
            />
          </div>
        </div>
      );
    if (isVideo || isAudio)
      return (
        <div className="relative flex flex-col items-center w-full">
          {_setMenuTools()}
          <div style={{ marginTop: -75 }} className="w-full">
            <DynamicMediaVideo
              content={media}
              title={title}
              description={description}
              markers={markers}
              copyright={copyright}
              onChange={onChange}
              isReadonly={false}
              id={uuid}
            />
          </div>
        </div>
      );
  }, [media]);

  useEffect(() => {
    if (fileData?.file?.[0].blob && isImage) {
      setMedia(fileData?.file?.[0].blob);
      const _onChange = onChange as ({ content }: { content: string }) => void;
      _onChange?.({ content: fileData?.file?.[0].blob });
      setIsOpen(false);
    }
    if (
      (fileData?.file?.[0].blob && isVideo) ||
      (fileData?.file?.[0].blob && isAudio)
    ) {
      const blobUrl = fileData?.file?.[0].blob;
      setMedia(blobUrl);
      const _onChange = onChange as ({ content }: { content: string }) => void;
      _onChange?.({ content: blobUrl });
      setIsOpen(false);
    }
  }, [fileData]);
  useEffect(() => {
    return () => {
      if (refTimeout.current) clearTimeout(refTimeout.current);
    };
  }, []);

  return (
    <div ref={ref}>
      <div className="mt-5 mb-5">{_setMedia}</div>
      <Popover
        shouldFlip
        shouldCloseOnBlur
        shouldBlockScroll
        showArrow
        offset={10}
        placement="right-end"
        isOpen={isOpen}
        shouldCloseOnInteractOutside={(e) => {
          if (e.id === "edit") {
            return false;
          }
          setIsOpen(false);
          return true;
        }}
      >
        <PopoverTrigger>
          <Button
            id="edit"
            size="sm"
            onClick={(): void => setIsOpen((isOpen) => !isOpen)}
          >
            Click to update {type}...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[680px]">
          {(titleProps) => (
            <div className="px-1 py-2 w-full">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              >
                Media
              </p>
              <div className="mt-2 w-full">
                <Tabs aria-label="Options">
                  <Tab key="link" title="link">
                    <Card>
                      <CardBody>
                        <Input
                          onKeyUp={_onKeyUp}
                          placeholder="Paste the media link..."
                          size="sm"
                          type="text"
                          label="Link"
                          onChange={_onChange}
                          defaultValue={isImage || isVideo ? media : ""}
                        />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="upload" title="Upload">
                    <Card>
                      <CardBody>
                        <input
                          type="file"
                          accept={filetype}
                          name="file"
                          onChange={handleChange}
                        />
                        {error.message !== "" ? error.message : <></>}
                      </CardBody>
                    </Card>
                  </Tab>
                  {props.type === "image" && (
                    <Tab key="unsplash" title="Unsplash">
                      <Card>
                        <CardBody className="no-scrollbar h-[600px]">
                          <DynamicMediaFomService
                            callback={_callback}
                            action=""
                          />
                        </CardBody>
                      </Card>
                    </Tab>
                  )}
                </Tabs>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MediaModule;
