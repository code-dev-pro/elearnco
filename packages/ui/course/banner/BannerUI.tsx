"use client";
import { Button, Image, Tooltip } from "@nextui-org/react";
import { useOnClickOutside, useWindowSize } from "customhooks";
import { checkHttps, getParamsFromUrlImage, updateImageUrl } from "lib";
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DATA_MENU_IMAGE,
  DATA_MENU_MEDIA,
  EActionsMedia,
  POINT,
  TPoint,
} from "schemas";
import { useCourseStore, useGlobalModalStore } from "store";

import { GoupeButtonUI } from "../../button/groupeButton/GroupeButtonUI";
import { BACKGROUND_NO_IMAGE, BANNER, ICON_SIZE, LAYOUT } from "../../const";
import { IconUI } from "../../icon/IconUI";
import { LoadingSpinnerUI } from "../../loading";

interface IProps {
  bannerT?: string | null;
  setBanner?: (path: string) => void;
  isEdition?: boolean;
}

type mode = "fill" | "fit";

export const BannerUI = (props: IProps) => {
  // Props
  const { bannerT, setBanner, isEdition = true } = props;
  // Store
  const { onOpen } = useGlobalModalStore();
  const { banner, updateBanner } = useCourseStore();
  // States
  const [currentPosition, setCurrentPosition] = useState<TPoint>(POINT);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [mode, setMode] = useState<mode>("fill");
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [RefH, setRefH] = useState<number>(0);
  // Hooks
  const { width } = useWindowSize();
  // Refs
  const initialPosition = useRef<TPoint>(POINT);
  const defaultPosition = useRef<TPoint>(POINT);
  const RefContainer = useRef<HTMLDivElement>(null);
  const RefPhotoContainer = useRef<HTMLButtonElement>(null);
  const RefImage = useRef<HTMLImageElement>(null);
  const isDragging = useRef<boolean>(false);
  const offset = useRef<TPoint>(POINT);
  const RefRatio = useRef<number>(0);

  // Methods
  const _removeAllListeners = (): void => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchend", handleMouseUp);
  };

  const setHeight = (): void => {
    if (RefImage.current) {
      const _refCon = RefContainer.current?.getBoundingClientRect().width;
      if (_refCon) {
        setRefH((_refCon * BANNER.MAX_HEIGHT) / LAYOUT.MAX_WIDTH);
      }
    }
    if (isMoving) setIsMoving(false);
  };

  const onError = (): void => {
    //ADD ERROR MESSAGE
    setIsloading(false);
    setRefH(BANNER.MAX_HEIGHT);
  };

  const onLoad = (event: SyntheticEvent<HTMLImageElement, Event>): void => {
    setIsloading(false);
    const _target = event.target as HTMLImageElement;
    if (_target) {
      RefRatio.current = _target.naturalWidth / _target.naturalHeight;
    }
    setRefH(BANNER.MAX_HEIGHT);
  };

  const handleMouseDown = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ): void => {
    if (isDragging.current || !isMoving) return;
    isDragging.current = true;
    let _event;
    let clientY = 0;
    event.preventDefault();

    if (event.type === "mousedown") {
      _event = event as React.MouseEvent;
      clientY = _event.clientY - offset.current.y;
    } else {
      _event = event as React.TouchEvent;
      clientY = _event.touches[0].clientY - offset.current.y;
    }
    initialPosition.current = { x: 0, y: clientY };
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (event: MouseEvent | TouchEvent): void => {
    if (!isDragging.current || !RefImage.current) return;
    event.preventDefault();

    let _event;
    let clientY = 0;

    if (event.type === "mousemove") {
      _event = event as MouseEvent;
      clientY = _event.clientY - initialPosition.current.y;
    } else {
      _event = event as unknown as TouchEvent;
      clientY = _event.touches[0].clientY - initialPosition.current.y;
    }
    const _deltaY = Math.abs(
      (defaultPosition.current.y * RefImage.current?.height) / 100
    );

    if (
      Math.round(Math.abs(clientY)) + _deltaY >
        RefImage.current.getBoundingClientRect().height - RefH ||
      Math.round(clientY) > _deltaY
    ) {
      return;
    }
    setCurrentPosition({
      x: 0,
      y: (clientY / RefImage.current?.height) * 100 + defaultPosition.current.y,
    });

    offset.current = { x: 0, y: clientY };
  };
  const handleMouseUp = (): void => {
    if (!isDragging.current || !isMoving) return;
    isDragging.current = false;

    _removeAllListeners();
  };

  const _savePosition = () => {
    const newURL = updateImageUrl(banner, 0, currentPosition.y, mode);
    updateBanner(newURL);
    setIsMoving((isMoving) => !isMoving);
  };

  /** ACTIONS MENU */
  const clickHandler = useCallback(
    (action: string): void => {
      if (action === (EActionsMedia.UPATE_POSITION as string)) {
        setIsMoving((prev) => !prev);
        return;
      }
      if (action === (EActionsMedia.EDIT as string)) {
        onOpen("Edit image", { src: banner, callback: updateBanner });
        return;
      }
      if (action === (EActionsMedia.DELETE as string)) {
        updateBanner("");
        setBanner?.("");
        return;
      }
      if (action === (EActionsMedia.FILL_IMAGE as string)) {
        if (mode === "fit") {
          savePropsImage("fill");
          setMode("fill");
        }

        return;
      }
      if (action === (EActionsMedia.FIT_IMAGE as string)) {
        if (mode === "fill") {
          savePropsImage("fit");
          setMode("fit");
        }

        return;
      }

      onOpen(action, {});
    },
    [banner, mode]
  );

  const savePropsImage = (mode: string): void => {
    const newURL = updateImageUrl(banner, 0, currentPosition.y, mode);
    updateBanner(newURL);
    setIsMoving(false);
  };

  useOnClickOutside(RefPhotoContainer, () => {
    if (isMoving) {
      setIsMoving(false);
    }
  });

  useEffect(() => {
    setHeight();
  }, [width]);

  useEffect(() => {
    setBanner?.(banner);
    const BANNER_PARAMS = getParamsFromUrlImage(banner);

    initialPosition.current.y = BANNER_PARAMS.y;
    defaultPosition.current.y = BANNER_PARAMS.y;
    setCurrentPosition({ x: 0, y: BANNER_PARAMS.y });
    setMode(BANNER_PARAMS.mode as mode);
  }, [banner]);

  useEffect(() => {
    return () => {
      _removeAllListeners();
    };
  }, []);

  const _banner = bannerT ?? banner;
  const isPattern = !checkHttps(_banner);
  const BANNER_COURSE = !isPattern ? _banner : `/patterns/${_banner}.svg`;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        borderRadius: isEdition ? "24px 24px 0 0" : "24px",
        ...(_banner !== "" ? {} : BACKGROUND_NO_IMAGE),
      }}
    >
      {isEdition ? (
        !isMoving ? (
          <div
            style={{ zIndex: 99, right: 0 }}
            className="absolute top-0 w-full right-0 z-50 p-4"
          >
            {_banner === "" ? (
              <GoupeButtonUI
                isDisabled={false}
                data={DATA_MENU_MEDIA}
                orientation="horizontal"
                onClickHandler={clickHandler}
              />
            ) : (
              <GoupeButtonUI
                isDisabled={false}
                data={
                  isPattern
                    ? DATA_MENU_IMAGE.filter(
                        (item) =>
                          item.label !== EActionsMedia.UPATE_POSITION &&
                          item.label !== EActionsMedia.EDIT &&
                          item.label !== EActionsMedia.FILL_IMAGE &&
                          item.label !== EActionsMedia.FIT_IMAGE
                      )
                    : mode === "fit" && !isPattern
                    ? DATA_MENU_IMAGE.filter(
                        (item) => item.label !== EActionsMedia.UPATE_POSITION
                      )
                    : DATA_MENU_IMAGE
                }
                orientation="horizontal"
                onClickHandler={clickHandler}
                isBanner
              />
            )}
          </div>
        ) : (
          <div className="absolute z-50 flex justify-end w-fit p-4 gap-2 right-0">
            <Tooltip content="Valid">
              <Button
                size="sm"
                onClick={_savePosition}
                isIconOnly
                aria-label="Valid"
              >
                <IconUI
                  name="check"
                  width={ICON_SIZE.width}
                  height={ICON_SIZE.height}
                />
              </Button>
            </Tooltip>
            <Tooltip content="Close">
              <Button
                size="sm"
                onClick={(): void => setIsMoving((isMoving) => !isMoving)}
                isIconOnly
                aria-label="close"
              >
                <IconUI
                  name="close"
                  width={ICON_SIZE.width}
                  height={ICON_SIZE.height}
                />
              </Button>
            </Tooltip>
          </div>
        )
      ) : (
        <></>
      )}

      <div
        className="banner-wrapper w-full relative overflow-hidden"
        style={{
          height: RefH || "100%",
        }}
      >
        <span className="photo-wrapper w-full h-full">
          <span
            ref={RefPhotoContainer}
            className="photo-container flex items-center justify-center w-full relative"
            style={{ height: RefH }}
          >
            {/* MODE FIT */}
            {isLoading && (
              <div className="w-full z-50 flex items-baseline justify-center">
                <LoadingSpinnerUI />
              </div>
            )}

            {mode === "fit" && _banner !== "" && (
              <>
                <span
                  className="photo-background absolute h-full w-full"
                  style={{
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundImage: `url(${BANNER_COURSE?.split("?")?.[0]})`,
                    filter: "blur(16px)",
                    opacity: 0.4,
                  }}
                />
                <img
                  style={{
                    height: "100%",
                  }}
                  src={BANNER_COURSE?.split("?")?.[0]}
                  className="photo-image absolute w-full top-0 bottom-0 object-contain max-w-fit left-auto"
                />
              </>
            )}
            <span
              ref={RefContainer}
              className="drag-wrapper w-full static"
              style={{
                height: "auto",
                objectFit: "unset",
                visibility: mode === "fit" ? "hidden" : "visible",
              }}
            >
              <div className="drag-inner" style={{ display: "contents" }}>
                <button
                  style={{
                    cursor:
                      isMoving && !isDragging.current
                        ? "grab"
                        : isDragging.current
                        ? "grabbing"
                        : "inherit",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: `translate(0px, ${currentPosition.y}%)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  onMouseDown={(e) =>
                    handleMouseDown(
                      e as unknown as
                        | React.MouseEvent<HTMLDivElement, MouseEvent>
                        | React.TouchEvent<HTMLDivElement>
                    )
                  }
                >
                  <Image
                    ref={RefImage}
                    onLoad={(e) => onLoad(e)}
                    onError={onError}
                    draggable={false}
                    width="100%"
                    height="100%"
                    radius="none"
                    removeWrapper
                    alt=""
                    src={BANNER_COURSE?.split("?")?.[0]}
                    style={{
                      objectFit: "cover",
                      position: "static",
                      userSelect: "none",
                    }}
                  />
                </button>
              </div>
            </span>
          </span>
        </span>
      </div>
    </div>
  );
};
