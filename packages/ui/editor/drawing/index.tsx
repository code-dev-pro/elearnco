import { nanoid } from "lib";
import React, { useEffect, useRef,useState } from "react";
import { POINT,TPoint } from "schemas";

import { LAYOUT } from "../../const";
import { calculateBounds, getAveragePoint } from "../utils";
import { COLORS, CONFIG } from "./const";
import Circle from "./Shapes/Circle";
import Path from "./Shapes/Path";
import Polygon from "./Shapes/Polygon";
import Toolbar from "./Toolbar";
import Tooltip from "./Tooltip";
import { TBounds, TCanvas, TFreeHand,TShape } from "./types";

const WIDTH = LAYOUT.MEDIA
export const SimpleDrawingSvg = (props: TCanvas) => {
  //Canvas props
  const { size } = props;
  //Mouse Position
  const [position, setPosition] = useState<TPoint>(POINT);
  //Points Collection for poly
  const [collection, setCollection] = useState<TShape[]>([]);
  //Polygon Collection

  const [collectionPolygons, setCollectionPolygons] = useState<
    { id: string; shape: TShape[]; content: string }[]
  >([
    {
      id: "hfMpj9gylc",
      shape: [
        { shape: "circle", x: 185, y: 175, id: "ARaNgOo" },
        { shape: "circle", x: 348, y: 145, id: "JNCUiSF" },
        { shape: "circle", x: 374, y: 187, id: "8XF0YDj" },
        { shape: "circle", x: 314, y: 283, id: "w2R5blA" },
        { shape: "circle", x: 164, y: 274, id: "PLJzBRu" },
      ],
      content: "Bonjour lolo",
    },
  ]);
  //FreeHand Collection
  const [collectionFreeHand, setCollectioncollectionFreeHand] = useState<
    TFreeHand[]
  >([]);
  //Point of polygon selected
  const [positionInShape, setPositionInShape] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

 
  const [bounds, setBounds] = useState<TBounds | null>(null);
  const [activeTool, setActiveTool] = useState<string>("pen");
  const isDragging = useRef<boolean>(false);
  const refCanvas = useRef<SVGSVGElement | null>(null);
  const refCurrentDrag = useRef<HTMLElement | SVGSVGElement | null>(null);
  const relativeCoordinates = useRef<TPoint>(POINT);
  const lastMousePoints = useRef<number[][]>([]);
  const [freeHandle, setFreeHandle] = useState<string>("M0 0");
  const currentPathText = useRef<string>("");
  const clonePathText = useRef<string>("");
  const currentColor = useRef<string>(COLORS.BLUE.hex);
  const currentBrush = useRef<number>(2);
  const currentSelect = useRef<string>("");
  const onSelect = (points: TShape[], id: string): void => {
    currentSelect.current = id;
    const bounds = calculateBounds(points);
    setBounds(bounds);
  };
  const handleMouseDown = (
    event:
      | React.MouseEvent<
          HTMLDivElement | SVGSVGElement | SVGCircleElement,
          MouseEvent
        >
      | React.TouchEvent<HTMLDivElement | SVGSVGElement | SVGCircleElement>
  ): void => {
    if (isDragging.current) return;
    isDragging.current = false;
    let _event;
    let clientX = 0;
    let clientY = 0;
    event.preventDefault();
    const target = event.target as HTMLElement | SVGSVGElement;
    const element = event.currentTarget as HTMLDivElement | SVGSVGElement;
    const rect = element.getBoundingClientRect();

    if (target.hasAttribute("is-polygon")) {
      return;
    }

    if (event.type === "mousedown") {
      _event = event as React.MouseEvent;
      clientX = _event.clientX;
      clientY = _event.clientY;
    } else {
      _event = event as React.TouchEvent;
      clientX = _event.touches[0].clientX;
      clientY = _event.touches[0].clientY;
    }

    const x = Math.round(clientX - rect.left);
    const y = Math.round(clientY - rect.top);
    setPosition({ x: x, y: y });
    relativeCoordinates.current = { x: rect.left, y: rect.top };

    //DRAWING FREEHAND
    if (activeTool === "pen") {
      currentPathText.current = "M" + x + " " + y;
      setFreeHandle(currentPathText.current);
    }

    //CLOSE POLYGON
    if (collection.length >= 2 && target.hasAttribute("is-handle")) {
      //We need to associate text input with polygons
      const id = nanoid(10);
      setCollectionPolygons([
        ...collectionPolygons,
        { id: id, shape: collection, content: "Add your text" },
      ]);

      setCollection([]);
    } else if (
      target.nodeName === "svg" &&
      activeTool === "pentagon" &&
      !bounds
    ) {
      setCollection([
        ...collection,
        { shape: "circle", x: x, y: y, id: nanoid(10) },
      ]);
    } else if (target.hasAttribute("is-handle-polygon")) {
      setPositionInShape({ id: target.id, x: x, y: y });
    }
    if (activeTool === "pen" || activeTool === "pentagon") {
      refCurrentDrag.current = target;
      refCanvas?.current?.addEventListener("touchmove", handleMouseMove);
      refCanvas?.current?.addEventListener("touchend", handleMouseUp);
      refCanvas?.current?.addEventListener("mousemove", handleMouseMove);
      refCanvas?.current?.addEventListener("mouseup", handleMouseUp);
    }
    if (bounds) {
      setBounds(null);
      currentSelect.current = "";
    }
  };
  const handleMouseMove = (event: MouseEvent | TouchEvent): void => {
    if (isDragging.current) return;
    event.preventDefault();
    if (bounds) setBounds(null);
    //const target = event.target as HTMLElement;
    // changeCursor("grabbing");
    let _event;
    let clientX = 0;
    let clientY = 0;
    if (event.type === "mousemove") {
      _event = event as MouseEvent;
      clientX = _event.clientX;
      clientY = _event.clientY;
    } else {
      _event = event as unknown as TouchEvent;
      clientX = _event.touches[0].clientX;
      clientY = _event.touches[0].clientY;
    }

    if (
      refCurrentDrag.current &&
      refCurrentDrag.current.hasAttribute("is-handle-polygon")
    ) {
      setPositionInShape({
        id: refCurrentDrag.current.id,
        x: Math.round(clientX - relativeCoordinates.current.x),
        y: Math.round(clientY - relativeCoordinates.current.y),
      });
    } else {
      setPosition({
        ...position,
        x: Math.round(clientX - relativeCoordinates.current.x),
        y: Math.round(clientY - relativeCoordinates.current.y),
      });

      if (activeTool === "pen") {
        lastMousePoints.current.push([
          Math.round(clientX - relativeCoordinates.current.x),
          Math.round(clientY - relativeCoordinates.current.y),
        ]);
        if (lastMousePoints.current.length >= CONFIG.configNormalisation) {
          lastMousePoints.current.shift();
        }
        let avgPoint = getAveragePoint(0, lastMousePoints.current);
        if (avgPoint) {
          currentPathText.current =
            currentPathText.current + " L" + avgPoint.x + " " + avgPoint.y;
          let tmpPath = "";
          for (
            let offset = 2;
            offset < lastMousePoints.current.length;
            offset += 2
          ) {
            avgPoint = getAveragePoint(offset, lastMousePoints.current);
            if (avgPoint) tmpPath += " L" + avgPoint.x + " " + avgPoint.y;
          }
          clonePathText.current = currentPathText.current + tmpPath;
          setFreeHandle(clonePathText.current);
        }
      }
    }
  };
  const handleMouseUp = (): void => {
    isDragging.current = false;
    refCurrentDrag.current = null;

    if (activeTool === "pen") {
      const _clones = collectionFreeHand;

      _clones.push({
        shape: "freehand",
        path: clonePathText.current,
        id: nanoid(11),
        color: currentColor.current,
        stroke: currentBrush.current,
      });

      setCollectioncollectionFreeHand(_clones);
    }
    currentPathText.current = "";
    clonePathText.current = "";
    lastMousePoints.current = [];
    setFreeHandle("M0 0 ");
    removeAllListeners();
  };
  const handleClean = (): void => {
    lastMousePoints.current = [];
    setFreeHandle("M0 0 ");
    setCollectionPolygons([]);
    setCollectioncollectionFreeHand([]);
    setCollection([]);
    setBounds(null);
  };
  const _onDoubleClick = (id: string): void => {
    setCollection((prevState) => prevState.filter((shape) => shape.id !== id));
  };

  const _onChange = (value: string): void => {
    const id = currentSelect.current;
    if (id) {
      setCollectionPolygons((prevCollection) => {
        return prevCollection.map((item) => {
          if (item.id === id) {
            return { ...item, content: value };
          }
          return item;
        });
      });
    }
  };

  const getContentById = (id: string): string => {
    const item = collectionPolygons.find((item) => item.id === id);
    return item ? item.content : "Add you text";
  };

  const removeAllListeners = (): void => {
    refCanvas?.current?.removeEventListener("mousemove", handleMouseMove);
    refCanvas?.current?.removeEventListener("mouseup", handleMouseUp);
    refCanvas?.current?.removeEventListener(
      "touchmove",
      (event: MouseEvent | TouchEvent) => handleMouseMove(event)
    );
    refCanvas?.current?.removeEventListener("touchend", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      removeAllListeners();
    };
  }, []);

  return size.width ? (
    <>
      {bounds ? (
        <Tooltip
          onChange={_onChange}
          bounds={bounds}
          defaultValue={getContentById(currentSelect.current)}
        />
      ) : (
        <></>
      )}
      <div className="absolute top-0 left-0 z-50 w-full h-auto">
        <svg
          ref={refCanvas}
          id="svgContainer"
          onMouseDown={handleMouseDown}
          style={{ background: "transparent", opacity: 1 }}
          viewBox={`0 0 ${WIDTH} ${(WIDTH / size.width) * size.height}`}
        >
          {collectionPolygons.map((polygon, index) => {
            return (
              <React.Fragment key={polygon.id}>
                <Polygon
                  id={polygon.id}
                  positionInShape={positionInShape}
                  onMouseDown={handleMouseDown}
                  canva={refCanvas.current}
                  points={polygon.shape}
                  cursor=""
                  onSelect={onSelect}
                />
              </React.Fragment>
            );
          })}

          {/* {bounds && (
            <rect
              x={bounds.minX}
              y={bounds.minY}
              width={bounds.maxX - bounds.minX}
              height={bounds.maxY - bounds.minY}
              stroke="white"
              fill="none"
            />
          )} */}

          {collection.map((shape, index) => {
            return (
              <React.Fragment key={shape.id}>
                <Circle
                  x={shape.x}
                  y={shape.y}
                  id={shape.id}
                  stroke="dodgerblue"
                  fill="dodgerblue"
                  cursor="pointer"
                  onDoubleClick={_onDoubleClick}
                />
                {collection.length >= 2 && index >= 1 && (
                  <line
                    x1={collection[index - 1].x}
                    y1={collection[index - 1].y}
                    x2={collection[index].x}
                    y2={collection[index].y}
                    stroke="#53DBF3"
                    strokeWidth="1"
                  />
                )}
              </React.Fragment>
            );
          })}

          {collectionFreeHand.map((hand) => (
            <React.Fragment key={hand.id}>
              <Path
                strokeWidth={hand.stroke}
                d={hand.path}
                stroke={hand.color}
                id={hand.id}
              />
            </React.Fragment>
          ))}

          <path
            strokeWidth={currentBrush.current}
            stroke={currentColor.current}
            strokeLinecap="round"
            fill="none"
            d={freeHandle}
          />
        </svg>
      </div>
      <div
        style={{ paddingBottom: 0, width: 50, left: 0, height: 350, top: 20 }}
        className="absolute flex justify-center z-50"
      >
        <Toolbar
          getActiveTool={(tool: string) => setActiveTool(tool)}
          getActiveColor={(color: string) => (currentColor.current = color)}
          getActiveBrush={(brush: number) => (currentBrush.current = brush)}
          clean={handleClean}
          defaultColor={currentColor.current}
          defaultBrush={currentBrush.current}
        />
      </div>
    </>
  ) : (
    <></>
  );
};

const DrawinEditor = (props: TCanvas) => {
  return <SimpleDrawingSvg {...props} />;
};

export default DrawinEditor;
