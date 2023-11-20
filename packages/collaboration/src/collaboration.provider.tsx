import { useSafeContext } from "customhooks/use-safeContext";
import { createContext, ReactNode, useEffect } from "react";

import {
  CollaborationLayout,
  CollaborationLayoutProps,
} from "./components/collaboration-layout";
import { CollaborationMouseUpdater } from "./components/collaboration-mouse-updater";
import { useAwarenessStateField } from "./hooks/useAwareness";
import { useYjs, YjsContextState } from "./yjs.provider";

export type CollaborationContextState = YjsContextState & { isLeader: boolean };

export const CollaborationContext =
  createContext<CollaborationContextState | null>(null);

export type CollaborationProviderProps = {
  children: ReactNode;
  username: string;
} & CollaborationLayoutProps;

export const CollaborationProvider = ({
  children,
  ...rest
}: CollaborationProviderProps) => {
  const yjs = useYjs();
  const [usernames, username, setUsername] =
    useAwarenessStateField<string>("username");
  const [leaders, isLeader, setLeader] =
    useAwarenessStateField<boolean>("leader");

  useEffect(() => {
    if (!yjs.connected) {
      setUsername(undefined);
    } else {
      setUsername(rest.username);
    }
  }, [yjs.connected, setUsername, rest.username]);

  useEffect(() => {
    if (!yjs.connected) return;

    const keys = Object.keys(leaders).map((k) => +k);
    const values = Object.values(leaders);

    if (values.length <= 1) return;
    if (values.find((l) => l === true)) return;

    // Defining new leader based on clientID
    const newLeader = Math.max(...keys);
    if (yjs.doc.clientID !== newLeader) return;

    setLeader(true);
  }, [leaders, yjs.connected, yjs.doc.clientID, setLeader]);

  return (
    <CollaborationContext.Provider
      value={{
        ...yjs,
        isLeader: Object.keys(leaders).length <= 1 ? true : isLeader,
      }}
    >
      <CollaborationLayout {...rest} />
      <CollaborationMouseUpdater />
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () =>
  useSafeContext(CollaborationContext, "CollaborationContext");
