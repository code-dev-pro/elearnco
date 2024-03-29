import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import "./index.css";
import React, { CSSProperties, HTMLAttributes, useState } from "react";
import clsx from "clsx";
import { MediaBlockType, TextBlockType } from "schemas";
import { useCourseStore } from "store";
import { CompletePage } from "schemas";
import { clean, reorganizeIndexes, reorganizePerIndex } from "lib";
import { Image } from "@nextui-org/react";
import TypographyBlockUI from "ui/typography/TypographyBlockUI";
import TypographyUI from "ui/typography/TypographyUI";

type style = { style: CSSProperties };
type PageFrameProps = CompletePage & { imageProps: style } & {
  overlay?: boolean;
  active?: boolean;
  insertPosition?: "before" | "after";
  attributes?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  listeners?: Partial<React.HTMLAttributes<HTMLDivElement>>;
};
export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  withOpacity?: boolean;
  isDragging?: boolean;
};
//TODO ADD OTHER BLOCK TYPE RENDER
const getBlock = (block) => {
  const type = block.type;
  const content = block.content?.[0]?.content;
  const text = content?.content;

  if (!text || text === "") return <></>;

  if (type === TextBlockType.TITLE) {
    return (
      <TypographyUI>
        <TypographyUI.Title
          level={2}
          style={{
            marginBottom: "0rem",
            fontWeight: "bold",
            marginTop: 0,
            fontSize: "60%",
            padding: 0,
            lineHeight: "normal",
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: clean(text) }} />
        </TypographyUI.Title>
      </TypographyUI>
    );
  }
  if (type === TextBlockType.SUBTITLE) {
    return (
      <TypographyUI>
        <TypographyUI.Title
          level={2}
          style={{
            marginBottom: "0px",
            fontWeight: "bold",
            marginTop: 0,
            fontSize: "40%",
            padding: 0,
            lineHeight: 2,
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: clean(text) }} />
        </TypographyUI.Title>
      </TypographyUI>
    );
  }
  if (type === MediaBlockType.IMAGE) {
    return (
      <Image
              alt="Image"
              className="object-cover"
              src={text}
              width="100%"
              radius="sm"
              style={{ height: "70px" }}
            />
    );
  }
  return (
    <TypographyBlockUI>
      <TypographyBlockUI.Definition
        isWithIcon={false}
        type={type}
        style={{ margin: 0, padding: 5 }}
      >
        <TypographyUI>
          <TypographyUI.Text
            style={{
              marginBottom: "0rem",
              fontSize: "15%",
              textAlign: "justify",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: clean(text) }} />
          </TypographyUI.Text>
        </TypographyUI>
      </TypographyBlockUI.Definition>
    </TypographyBlockUI>
  );
};
const Item = React.memo(
  React.forwardRef<HTMLDivElement, PageFrameProps>(function PhotoFrame(
    props,
    ref
  ) {
    const {
      imageProps,
      overlay,
      active,
      insertPosition,
      attributes,
      listeners,
      cover,
      index,
      title,
    } = props;
    const { style } = imageProps;

    return (
      <div
        ref={ref}
        style={{
          width: overlay ? `calc(100% - ${20}px)` : style.width,
          marginBottom: style.marginBottom,
          padding: style.padding,
          height: style.height,
          // overflow: style.overflow,
          position: "relative",
          pointerEvents: index === 1 ? "none" : "auto",
        }}
        className={clsx("page-frame bg-default", {
          overlay: overlay,
          active: active,
          insertBefore: insertPosition === "before",
          insertAfter: insertPosition === "after",
        })}
        {...attributes}
        {...listeners}
      >
        <div style={{ height: 238 }} className="flex flex-col overflow-hidden">
          {index === 1 && (
            <div
              style={{
                minHeight: 50,
                borderRadius: 10,
                marginBottom: "0.25rem",
              }}
              className="w-full overflow-hidden"
            >
              <Image
                radius="none"
                removeWrapper
                width={158}
                alt=""
                src={cover as string}
              />
            </div>
          )}

          {reorganizePerIndex(props.blocks).map((block) => (
            <div key={block.uuid}>
              <div style={{ marginTop: "0.15rem" }}>{getBlock(block)}</div>
            </div>
          ))}
        </div>
        <p className="absolute mt-4 left-0 text-center w-full top-full text-white text-xs">{`${
          title === "" ? `Page ${props.index}` : title
        }`}</p>
      </div>
    );
  })
);
const SortableItem = (props) => {
  const { id, activeIndex } = props;

  const { attributes, listeners, isDragging, index, over, setNodeRef } =
    useSortable({ id: id });

  return (
    <Item
      ref={setNodeRef}
      active={isDragging}
      insertPosition={
        activeIndex !== undefined && over?.id === id && !isDragging
          ? index > activeIndex
            ? "after"
            : "before"
          : undefined
      }
      aria-label="sortable image"
      attributes={attributes}
      listeners={listeners}
      imageProps={{
        style: {
          width: 156,
          height: 238,
          padding: 10,
          marginBottom: 10,
          // overflow: "hidden",
        },
      }}
      {...props}
    />
  );
};
const Grid = ({ children, columns }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridGap: 50,
        margin: "0px auto",
      }}
    >
      {children}
    </div>
  );
};
const SortablePages = () => {
  const { pages, reorderPage, banner } = useCourseStore();
  const [collectionPages, setPages] = useState(pages);
  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  const renderedPages = React.useRef<{ [key: string]: CompletePage }>({});

  const activeIndex = activeId
    ? collectionPages.findIndex((page) => page.id === activeId)
    : undefined;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 10 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = React.useCallback(
    ({ active }: DragStartEvent): void => setActiveId(active.id),
    []
  );

  const handleDragEnd = React.useCallback((event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const _order = arrayMove(items, oldIndex, newIndex);
        const _newOrder = reorganizeIndexes(_order, 1);
        reorderPage(_newOrder);
        return _newOrder;
      });
    }

    setActiveId(undefined);
  }, []);

  const renderPage = (props: CompletePage): JSX.Element => {
    renderedPages.current[props.id] = props;

    return <SortableItem activeIndex={activeIndex} {...props} />;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={collectionPages}>
        <div style={{ margin: 30 }}>
          <Grid columns={5}>
            {collectionPages.map((props) => (
              <React.Fragment key={props.id}>
                {renderPage({ ...props, cover: banner })}
              </React.Fragment>
            ))}
          </Grid>
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId && (
          <Item
            overlay
            {...renderedPages.current[activeId]}
            imageProps={{
              style: {
                width: 156,
                height: 238,
                padding: 20,
                marginBottom: 10,
              },
            }}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
export default SortablePages;
