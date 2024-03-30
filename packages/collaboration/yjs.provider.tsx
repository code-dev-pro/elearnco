import { useSafeContext } from "customhooks/use-safeContext";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Awareness } from "y-protocols/awareness.js";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

export type YjsContextState = {
  doc: Y.Doc;
  connected: boolean;
  awareness: Awareness;
  provider?: WebrtcProvider;
  connect: (room: string) => void;
  disconnect: () => void;
};

export const YjsContext = createContext<YjsContextState | null>(null);

export const YjsProvider = ({ children }: { children: ReactNode }) => {
  const [doc] = useState(new Y.Doc());
  const [awareness, setAwareness] = useState<Awareness>(new Awareness(doc));
  const [provider, setProvider] = useState<WebrtcProvider>();
  const [connected, setConnected] = useState<boolean>(false);

  const connectingRef = useRef<boolean>(false);

  const connect = useCallback(
    (room: string) => {
      if (connectingRef.current) return;

      // console.log(`Connecting to room ${room}`);

      connectingRef.current = true;

      const awareness = new Awareness(doc);

      const provider = new WebrtcProvider(room, doc, {
        signaling: ["ws://localhost:8001"],
        awareness,
      });

      setAwareness(awareness);
      setProvider(provider);
      setConnected(true);
    },
    [doc, connectingRef]
  );

  const disconnect = useCallback(() => {
    if (!provider || !provider.connected) return;
    provider.disconnect();
    doc.destroy();
    setConnected(false);
  }, [provider, doc]);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return (
    <YjsContext.Provider
      value={{ connect, disconnect, connected, doc, awareness, provider }}
    >
      {children}
    </YjsContext.Provider>
  );
};
//@ts-ignore
export const useYjs = () => useSafeContext(YjsContext, "YjsContext");
