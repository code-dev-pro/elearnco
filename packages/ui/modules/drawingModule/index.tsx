"use client";
import "@tldraw/tldraw/tldraw.css";

import { setUserPreferences, Tldraw, TLEventInfo } from "@tldraw/tldraw";
import React, { useCallback, useEffect } from "react";

//import WriterModule from "../writeModule";
// persistenceKey
const DrawingEditor = (props: {
  blockID: string;
  type: string;
  editable?: boolean;
}) => {
  const { blockID, type = "paragraph", editable = true } = props;

  const handleEvent = useCallback((data: TLEventInfo) => {
    //setEvents((events) => [JSON.stringify(data, null, 2), ...events.slice(0, 100)])
  }, []);

  useEffect(() => {
    setUserPreferences({
      isDarkMode: true,
      id: blockID,
    });
  }, []);

  return (
    <>
      
      <div
        style={{ minHeight: 400, height: 400 }}
        className="w-full relative flex overflow-hidden"
      >
        <Tldraw
          sessionId={blockID}
          defaultName={blockID}
          persistenceKey={blockID}
          onMount={(editor) => {
            editor.on("event", (event) => handleEvent(event));
            editor.updateInstanceState({
              isDebugMode: false,
              isReadonly: true,
            });
          }}
        />
      </div>
    </>
  );
};

export default DrawingEditor;
