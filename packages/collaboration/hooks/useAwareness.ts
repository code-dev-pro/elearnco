import { isEqual } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useYjs } from "../yjs.provider";

/**
 * Can cause a really high number of rendering.
 * Prefer to use `useAwarnessStateField`
 *
 * @see useAwarenessStateField
 */
export const useAwarenessState = <T extends { [x: string]: any }>() => {
  const { awareness, connected } = useYjs();
  const [data, setData] = useState<{ [key: number]: T }>({});
  const local = useMemo(
    () => data[awareness.clientID],
    [awareness.clientID, data]
  );

  const set = useCallback(
    (data: T) => {
      awareness.setLocalState(data);
    },
    [awareness]
  );

  const update = useCallback(() => {
    const entries = awareness.getStates().entries();
    const data = [...Array.from(entries)]
      .map(([clientId, state]) => [clientId, state] as [number, T])
      .filter(([clientId, state]) => !!state)
      .reduce((a, b) => ({ ...a, [b[0]]: b[1] }), {});
    setData(data);
  }, [awareness]);

  useEffect(() => {
    awareness.on("change", update);
    return () => awareness.off("change", update);
  }, [awareness, update]);

  // Trigger update when new connexion occurs
  useEffect(() => {
    if (!connected) return;
    update();
  }, [connected, update]);

  return [data, local, set] as const;
};

export const useAwarenessStateField = <T>(key: string) => {
  const { awareness, connected } = useYjs();
  const [data, setData] = useState<{ [key: number]: T }>({});
  const local = useMemo(
    () => data[awareness.clientID],
    [data, awareness.clientID]
  );

  const set = useCallback(
    (data: T | undefined) => {
      awareness.setLocalStateField(key, data);
    },
    [awareness, key]
  );

  const update = useCallback(
    (force?: boolean) => {
      // For performance purpose to avoid rerendering
      // TODO : Create context to add in-memory cache to avoid doing this multiple time for the same key
      const newData = [...Array.from(awareness.getStates().entries())]
        .map(([clientId, state]) => [clientId, state[key]])
        // .filter(([clientId, state]) => !!state)
        .reduce((a, b) => ({ ...a, [b[0]]: b[1] }), {} as { [key: number]: T });

      if (isEqual(data, newData)) return;

      setData(newData);
    },
    [data, key, awareness]
  );

  useEffect(() => {
    awareness.on("change", update);
    return () => awareness.off("change", update);
  }, [awareness, update]);

  // Trigger update when new connexion occurs
  useEffect(() => {
    if (!connected) return;
    update();
  }, [connected, update]);

  return [data, local, set] as const;
};
