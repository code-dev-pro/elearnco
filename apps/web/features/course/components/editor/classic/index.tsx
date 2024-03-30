import { PARENT_CSS, WIDTH_SIDEBAR } from "@/const";
import React, { PropsWithChildren, useState } from "react";
import { WorkspaceDndProvider, DrawerUI, BlockCardSectionsUI } from "ui";
import { appendUnit } from "lib";
import { useCoursesParams } from "customhooks";
import { EModeEditor } from "schemas";

const STYLE = {
  flex: "0 0 auto",
  transition: "width .35s cubic-bezier(.22, 1, .36, 1)",
};

const AuthoringMode = (props: PropsWithChildren) => {
  const { children } = props;
  // Hooks & States
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { getCurrentCourseMode } = useCoursesParams();
  const mode = getCurrentCourseMode();
  // Methods
  const _callback = (state: boolean): void => {
    setIsOpen(state);
  };
  const WIDTH = isOpen ? `${appendUnit(WIDTH_SIDEBAR)}` : "0";

  return (
    <div style={{ ...PARENT_CSS }}>
      <WorkspaceDndProvider>
        {mode === EModeEditor.adaptive ? (
          <></>
        ) : (
          <DrawerUI
            position="fixed"
            width={WIDTH_SIDEBAR}
            placeIn="right"
            classnames="no-scrollbar bg-default-50 h-full overflow-y-auto top-0"
            hasOverlay={false}
            actionHandler={_callback}
            {...{ paddingBottom: 125, marginTop: 80 }}
          >
            <BlockCardSectionsUI />
          </DrawerUI>
        )}

        <>{children}</>
      </WorkspaceDndProvider>

      <div className="relative left-full" style={{ ...STYLE, width: WIDTH }} />
    </div>
  );
};

export default AuthoringMode;
