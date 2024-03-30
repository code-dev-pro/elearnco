"use client";
import { useState } from "react";
import React from "react";

import { BlockCardSectionsUI } from "../block/BlockCardSectionsUI";
import { DrawerUI } from "../drawer/DrawerUI";
import { LayoutEditorUI } from "../layout/LayoutEditorUI";
import { WorkspaceDndProvider } from "../providers/WorkspaceDndProvider";

const PARENT_CSS = {
  display: "flex",
  flex: "1 1 auto",
  position: "relative",
  overflow: "hidden",
  minHeight: "calc(100vh - 64px)",
} as const;



export const EditorUI = () => {
  // Manage Drawer open
  const [isOpen, setIsOpen] = useState<boolean>(true);
  // Get ID COURSE

  const _callback = (state: boolean): void => {
    setIsOpen(state);
  };

  return (
    <div style={{ ...PARENT_CSS }}>
      <WorkspaceDndProvider>
        <DrawerUI
          position="absolute"
          width={350}
          placeIn="right"
          classnames="h-full"
          hasOverlay={false}
          actionHandler={_callback}
        >
          <BlockCardSectionsUI />
        </DrawerUI>
        <LayoutEditorUI />
      </WorkspaceDndProvider>
      <div
        className="bg-background"
        style={{
          flex: "0 0 auto",
          width: isOpen ? "350px" : "0",
          transition: "width .35s cubic-bezier(.22, 1, .36, 1)",
        }}
      />
    </div>
  );
};
