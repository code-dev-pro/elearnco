import {  useEffect, useRef, useState } from "react";
import { CardDashboardUI } from "ui/card/CardDashboardUI";

// small circle radius
const r1 = 5;
const r2 = 10;
const r3 = 15;
const width = 400;
const height = 375;

const minWH = Math.min(width, height);

let maxSize;
if (minWH < 430) {
  maxSize = minWH - 30;
} else {
  maxSize = 400;
}

// utils
// deg to radian
const rad = (a) => (Math.PI * (a - 90)) / 180;

// relative polar coordinates
const rx = (r, a, c) => c + r * Math.cos(rad(a));

const ry = (r, a, c) => c + r * Math.sin(rad(a));

// get hours, minutes, and seconds
const HMS = (t) => ({
  h: t.getHours(),
  m: t.getMinutes(),
  s: t.getSeconds(),
});

const pathStringVars = (c: number, r: number, time: Date) => {
  const { h, m, s } = HMS(time);

  const hAngFact = 30;
  const mAngFact = 6;
  const sAngFact = 6;

  const hx = rx(r - 30, hAngFact * h, c);
  const hy = ry(r - 30, hAngFact * h, c);
  const mx = rx(r - 30, mAngFact * m, c);
  const my = ry(r - 30, mAngFact * m, c);
  const sx = rx(r - 30, sAngFact * s, c);
  const sy = ry(r - 30, sAngFact * s, c);

  return { hx, hy, mx, my, sx, sy };
};

const TextTime = ({ x, y, time }: { x: number; y: number; time: Date }) => {
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLanguage(navigator.language);
    }
  }, []);

  const str = time.toTimeString().slice(0, 8).replace(/:/g, " : ");

  const formattedDate = new Intl.DateTimeFormat(language || "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(time);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      style={{
        textAnchor: "middle",
        alignmentBaseline: "middle",
        fontSize: "1.2rem",
        fontWeight: 100,
      }}
    >
      <tspan>{str}</tspan>
      <tspan x={x} dy="1.2em">
        {formattedDate}
      </tspan>
    </text>
  );
};

// Circle component
const Circle = ({
  cx,
  cy,
  radius,
  fill,
}: {
  cx: number;
  cy: number;
  radius: number;
  fill: string;
}) => <circle fill={fill} cx={cx} cy={cy} r={radius} />;

// Single spike
const Spike = ({
  x1,
  x2,
  y1,
  y2,
}: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}) => <line stroke="#fff" className="spike" x1={x1} x2={x2} y1={y1} y2={y2} />;

const spikeNodes = (c: number, radius: number) => {
  const increment = 30;
  const nodes: JSX.Element[] = [];

  for (let i = 1; i < 13; i++) {
    let ang = i * increment;

    let temp = (
      <Spike
        x1={rx(radius - 5, ang, c)}
        x2={rx(radius - 10, ang, c)}
        y1={ry(radius - 5, ang, c)}
        y2={ry(radius - 10, ang, c)}
        key={i}
      />
    );
    nodes.push(temp);
  }
  return nodes;
};

// populate Spikes
const Spikes = ({ c, radius }: { c: number; radius: number }) => (
  <g>{spikeNodes(c, radius)}</g>
);

// triangle component
const Triangle = ({ c, r, time }: { c: number; r: number; time: Date }) => {
  const { hx, hy, mx, my, sx, sy } = pathStringVars(c, r, time);
  const path = `M${hx},${hy} L${mx},${my} L${sx},${sy} L${hx},${hy}`;
  return <path fill="#000" className="triangle" d={path} />;
};

// Secondary circles
const SecCircle = ({ c, r, time }: { c: number; r: number; time: Date }) => {
  const { hx, hy, mx, my, sx, sy } = pathStringVars(c, r, time);
  return (
    <g>
      <Circle fill="hsl(212, 100%, 47%)" cx={hx} cy={hy} radius={r3} />
      <Circle fill="hsl(212, 100%, 47%)" cx={mx} cy={my} radius={r2} />
      <Circle fill="hsl(212, 100%, 47%)" cx={sx} cy={sy} radius={r1} />
    </g>
  );
};

const BodyChildren = () => {
  const [time, setTime] = useState<Date>(new Date());
  const size = maxSize;
  const viewBox = `0 0 ${size} ${size}`;
  const mid = size / 2;
  const paddedRadius = (size - 30) / 2;
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  return (
    <div className="flex w-full h-full justify-center items-center">
      <svg
        xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox}
        width={size}
        height={size}
      >
        <Circle fill="#252525" cx={mid} cy={mid} radius={mid - 5} />
        <Circle fill="#1c1c1c" cx={mid} cy={mid} radius={mid - 15} />
        <Spikes c={mid} radius={paddedRadius} />
        <Triangle c={mid} r={paddedRadius} time={time} />
        <SecCircle c={mid} r={paddedRadius} time={time} />
        <TextTime time={time} x={mid} y={mid} />
      </svg>
    </div>
  );
};
const CardClock = () => {
  return <CardDashboardUI bodyChildren={<BodyChildren />} />;
};

export default CardClock;
