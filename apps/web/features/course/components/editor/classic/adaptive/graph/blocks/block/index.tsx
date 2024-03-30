import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import {
  ActivityBlockType,
  CompleteBlock,
  GenericObject,
  TPoint,
} from "schemas";
import { ToolBlock } from "../toolBlock";
import { Divider } from "@nextui-org/react";
import { useDrag } from "@use-gesture/react";
import BlockPoint from "../blockPoint";
import { useEndpoints } from "../../provider/endpointsProvider";
import {
  capitalizeFirstLetterOfEachWord,
  clean,
  getBlockColor,
  isFileImage,
  isFileVideo,
} from "lib";
import { GROUPWIDTH, PADDING } from "../../const";
import { useGraph } from "../../provider/editorGraphProvider";
import { IconUI } from "ui/icon/IconUI";
import MediaVideo from "ui/modules/mediaModule/video/mediaVideo";
import { Wheel } from "ui";

const previewingBorderColor =
  "hsl(var(--nextui-primary) / var(--nextui-primary-opacity, var(--tw-bg-opacity)))";
const borderColor = "black";

const MemoBlockVideo = React.memo(({ content }: { content: string }) => {
  return (
    <MediaVideo
      content={content}
      title="Titre"
      type="video"
      copyright=""
      onChange={() => void 0}
      description=""
      isReadonly
      markers={[]}
    />
  );
});

const MemoBlockWheel = React.memo(({ content }: { content: any }) => {
  return (
    <Wheel
      data={content?.content.data}
      color={content?.content.color}
      onChange={() => void 0}
      isReadOnly
      size={280}
    />
  );
});

const Block = (
  props: Partial<CompleteBlock> & { graphScale: number } & {
    banner: string | null;
  }
) => {
  const { kindOfVue } = useGraph();
  const { id, index = 1, type = "", graphScale = 1, content, banner,uuid } = props;

 
  // const { getCurrentPage } = useCoursesParams();
  // const currentPage = getCurrentPage();

  const _content = content?.[0]?.content as GenericObject;
  const contentBlock = _content?.content?.data ? "" : _content?.content;

  const scale = graphScale;
  const BACKGROUND_COLOR = useMemo(
    () =>
      kindOfVue === "page" ? "#1273e8" : getBlockColor(type as string).color,
    []
  );
  const ICON =
    kindOfVue === "page"
      ? "cards"
      : type?.toLocaleLowerCase().trim().replace(/\s/g, "");

  // States ----------------------------------------------------------------
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [groupCoordinates, setGroupCoordinates] = useState<TPoint | null>(null);
  const { setSourceEndpointYOffset, setTargetEnpointYOffset } = useEndpoints();

  // Refs ----------------------------------------------------------------
  const groupRef = useRef<HTMLDivElement | null>(null);

  // Methods ----------------------------------------------------------------
  const _handleMouseEnter = useCallback((): void => setIsFocused(true), []);
  const _handleMouseLeave = useCallback((): void => setIsFocused(false), []);
  const _handleClick = (): void => void 0;
  const _setGroupCoordinates = (point: TPoint): void => {
    setGroupCoordinates(point);
    if (groupRef.current && id) {
      setSourceEndpointYOffset?.({
        id,
        position: {
          x: point.x - 8,
          y:
            point.y +
            groupRef.current?.getBoundingClientRect().height / 2 / scale,
        },
      });
      setTargetEnpointYOffset?.({
        id,
        position: {
          x: point.x + 8,
          y:
            point.y +
            groupRef.current?.getBoundingClientRect().height / 2 / scale,
        },
      });
    }
  };

  const _getCursor = useCallback(
    (): string => (isMouseDown ? "grabbing" : "grab"),
    [isMouseDown]
  );

  // Effects ----------------------------------------------------------------
  useEffect(() => {
    const position = groupCoordinates as TPoint | undefined;
    const forcePosition = !position ? true : false;

    const x = forcePosition
      ? (GROUPWIDTH + PADDING) * index
      : position?.x
      ? position.x
      : 0;
    const y = forcePosition ? 200 : position?.y ? position.y : 0;
    _setGroupCoordinates({ ...groupCoordinates, x: x / scale, y: y / scale });
  }, [id]);

  // Gesture on groupRef
  useDrag(
    ({ first, last, delta, event, target }) => {
      event.stopPropagation();
      if (first) {
        setIsFocused(true);
        setIsMouseDown(true);
      }
      if (groupCoordinates)
        _setGroupCoordinates({
          x: groupCoordinates?.x + delta[0] / scale,
          y: groupCoordinates?.y + delta[1] / scale,
        });

      if (last) {
        setIsMouseDown(false);
      }
    },
    {
      target: groupRef,
      pointer: { keys: false },
      from: () => [
        groupCoordinates?.x ? groupCoordinates.x * scale : 0,
        groupCoordinates?.y ? groupCoordinates.y * scale : 0,
      ],
    }
  );

  // Render ------------------------------------------------------------------
  return (
    <div
      ref={groupRef}
      id={`group-${id}`}
      data-testid="group"
      className="group absolute p-4 rounded-xl shadow-md bg-default/50"
      style={{
        borderWidth: "1px",
        borderColor:
          isMouseDown || isFocused ? previewingBorderColor : borderColor,
        width: GROUPWIDTH,
        height: "auto",
        zIndex: isFocused ? 10 : 1,

        cursor: _getCursor(),
        transition: "border 300ms, box-shadow 200ms",
        transform: `translate(${groupCoordinates?.x ?? 0}px, ${
          groupCoordinates?.y ?? 0
        }px)`,
        touchAction: "none",
      }}
      onMouseEnter={_handleMouseEnter}
      onMouseLeave={_handleMouseLeave}
      onClick={_handleClick}
    >
      {/* TYPE BLOCK */}

      <div
        style={{ color: BACKGROUND_COLOR }}
        className="flex gap-2 items-center font-bold"
      >
        {props.title ?? capitalizeFirstLetterOfEachWord(type) ?? "no title"}
      </div>
      <Divider />
      {/* CONTENT BLOCK */}
      <div className="w-full mt-2">
        {banner ? (
          <img
            draggable="false"
            style={{ width: "100%", height: "auto" }}
            src={banner}
          />
        ) : isFileImage(contentBlock) ? (
          <img
            draggable="false"
            style={{ width: "100%", height: "auto" }}
            src={contentBlock}
          />
        ) : isFileVideo(contentBlock) ? (
          <MemoBlockVideo content={contentBlock} />
        ) : type === ActivityBlockType.WHEEL ? (
          <MemoBlockWheel content={_content} />
        ) : (
          <div
            className="text-small"
            dangerouslySetInnerHTML={{ __html: clean(contentBlock) }}
          />
        )}
      </div>

      <BlockPoint
        source={{
          blockId: id,
        }}
        groupId={id}
        isTheLast={false}
        position="right"
      />
      {index === -1 ? (
        <></>
      ) : (
        <BlockPoint
          source={{
            blockId: id,
          }}
          groupId={id}
          isTheLast={false}
          position="left"
        />
      )}

      {groupRef.current &&
        isFocused &&
        createPortal(
          <div
            style={{
              top: "-41px",
            }}
            className="absolute right-0 z-1 pb-2"
          >
            <ToolBlock  id={id}  uuid={uuid} showBlock={():void => void 0} />
          </div>,
          groupRef.current
        )}

      {index === -1 ? (
        <></>
      ) : (
        <div className="absolute left-1/2 w-22 h-8 min-h-unit-8 -ml-10 top-full flex justify-center items-center mt-2">
          <div
            style={{ background: BACKGROUND_COLOR }}
            className="text-center text-xs flex justify-center items-center rounded-md p-4 min-w-unit-20 h-4"
          >
            <div className="flex gap-2 items-center flex-nowrap">
              <IconUI name={ICON} width={20} height={20} />
              {kindOfVue === "page"
                ? "Page-" + index
                : "Block " + Number(index + 1)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Block;
