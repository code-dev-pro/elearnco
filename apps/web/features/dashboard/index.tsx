"use client";
import dynamic from "next/dynamic";
import { stagger, useAnimate } from "framer-motion";
import { useEffect, useMemo } from "react";
import { GridItemInterface, GridItemType } from "schemas";
import { GridItems } from "schemas/dashboard/const";
import { CardDashboardUI } from "ui/card/CardDashboardUI";
import { LoadingSpinnerUI } from "ui";
import GridItem from "./components/gridItem";

const DynamicCardDashboardWelcome = dynamic(
  () => import("./components/cardDashboardWelcome"),
  {
    loading: () => (
      <CardDashboardUI bodyChildren={<LoadingSpinnerUI isIndiv />} />
    ),
  }
);
const DynamicCardDashboardProfil = dynamic(
  () => import("./components/cardProfil"),
  {
    loading: () => (
      <CardDashboardUI bodyChildren={<LoadingSpinnerUI isIndiv />} />
    ),
  }
);
const DynamicDashboardRecentCourse = dynamic(
  () => import("./components/cardRecentCourse"),
  {
    loading: () => (
      <CardDashboardUI bodyChildren={<LoadingSpinnerUI isIndiv />} />
    ),
  }
);
const DynamicDashboardRecentNews = dynamic(
  () => import("./components/cardNews"),
  {
    loading: () => (
      <CardDashboardUI bodyChildren={<LoadingSpinnerUI isIndiv />} />
    ),
  }
);
const DynamicDashboardTips = dynamic(() => import("./components/cardTip"), {
  loading: () => (
    <CardDashboardUI bodyChildren={<LoadingSpinnerUI isIndiv />} />
  ),
});
const DynamicDashboardClock = dynamic(() => import("./components/cardClock"), {
  loading: () => (
    <CardDashboardUI bodyChildren={<LoadingSpinnerUI isIndiv />} />
  ),
});

//NOTE - We present the dashboard like a bento
const FeatureDashboard = () => {
  const [scope, animate] = useAnimate();
  const staggerGridItems = stagger(0.02, {
    startDelay: 0.5,
  });

  const getCardTemplate = (type: GridItemType, item:GridItemInterface) => {
    if (type === "social") return <DynamicCardDashboardWelcome />;
    if (type === "course") return <DynamicDashboardRecentCourse />;
    if (type === "user") return <DynamicCardDashboardProfil />;
    if (type === "news") return <DynamicDashboardRecentNews {...item} />;
    if (type === "tips") return <DynamicDashboardTips {...item} />;
    if (type === "clock") return <DynamicDashboardClock />;
    return <div>Need to create new component for this type.</div>;
  };

  useEffect(() => {
    if (scope.current) {
      animate(
        "div",
        {
          scale: 1,
          y: 0,
          opacity: 1,
        },
        {
          type: "spring",
          stiffness: 330,
          damping: 35,
          delay: staggerGridItems,
        }
      );
    }
  }, [scope]);

  const GRID_ITEMS = useMemo(() => {
    return GridItems.map((item:GridItemInterface) => {
      return (
        <GridItem key={item.id} size={item.layout}>
          {getCardTemplate(item.type, item)}
        </GridItem>
      );
    });
  }, []);

  return (
    <div
      ref={scope}
      className="grid w-full grid-cols-4 xl:gap-5 gap-6 p-5 auto-rows-[76px]"
    >
      {GRID_ITEMS}
    </div>
  );
};
export default FeatureDashboard;
