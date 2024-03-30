"use client";

import { useLockedBody } from "customhooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ERoutes } from "schemas";

const WrapperChild = (props: React.PropsWithChildren) => {
  const pathname = usePathname();
  const { children } = props;
  const [locked, setLocked] = useLockedBody();
  const setOverFlowBody = (): void => {
    if (
      pathname.includes(ERoutes.COURSES) ||
      pathname.includes(ERoutes.EDITOR) ||
      pathname.includes(ERoutes.HOME) ||
      pathname.includes(ERoutes.PREVIEW)
    ) {
      if (!locked) {
        setLocked(true);
      }
    } else {
      setLocked(false);
    }
  };

  const setOverFlow = (): string => {
    if (pathname.includes(ERoutes.COURSES) || pathname.includes(ERoutes.HOME)) {
      return "overflow-y-auto";
    } else {
      return "overflow-y-hidden";
    }
  };

  const setOverHeight = (): string => {
    if (pathname.includes(ERoutes.COURSES) || pathname.includes(ERoutes.HOME)) {
      return "90px";
    } else {
      return " 0px";
    }
  };

  useEffect(() => {
    window?.scrollTo({
      top: 0,
    });
    setOverFlowBody();
  }, [pathname]);

  return (
    <div className="w-full h-full ">
      <div
        style={{
          height: `calc(100vh - ${setOverHeight()})`,
          ...{
            paddingBottom: pathname.includes("editor") ? 0 : 125,
            marginTop: pathname.includes("editor") ? 0 : 80,
          },
        }}
        className={`no-scrollbar overflow-x-hidden ${setOverFlow()} bg-background-50 z-auto w-full`}
      >
        {children}
      </div>
    </div>
  );
};

export default WrapperChild;
