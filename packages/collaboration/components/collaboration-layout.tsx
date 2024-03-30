import React, { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useAwarenessState } from "../hooks/useAwareness";
import { AwarenessState } from "../types";

export type CollaborationLayoutProps = {
  collaboratorElement?: (state: AwarenessState, clientID: number) => ReactNode;
};

export const CollaborationLayout = ({
  collaboratorElement,
}: CollaborationLayoutProps): JSX.Element | null => {
  //const [container, setContainer] = useState<HTMLElement | null>(null);
  const [states] = useAwarenessState<AwarenessState>();
  const containerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof window == "undefined") return;

    const _container = document.createElement("div");
    _container.classList.add("collaboration-layout");
    document.body.appendChild(_container);
    containerRef.current = _container;
    // setContainer(_container);
    return () => {
      if (
        containerRef.current &&
        containerRef.current.parentNode === document.body
      ) {
        document.body?.removeChild(containerRef.current);
      }
    };
  }, []);

  return (
    containerRef.current &&
    createPortal(
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 999999,
          pointerEvents: "none",
          background: "transparent",
        }}
      >
        {collaboratorElement &&
          Object.entries(states).map(([clientID, state]) => (
            <React.Fragment key={clientID}>
              {collaboratorElement(state, +clientID)}
            </React.Fragment>
          ))}
      </div>,
      containerRef.current
    )
  );
};

CollaborationLayout.displayName = "CollaborationLayout";
