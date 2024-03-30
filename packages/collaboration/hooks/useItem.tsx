import { useCallback, useEffect, useMemo, useState } from "react";
import * as Y from "yjs";

import { useYjs } from "../yjs.provider";

export function useYMap<T>(name: string) {
  const { doc } = useYjs();
  const item = useMemo(() => doc.getMap<T>(name), [doc, name]);

  return item;
}

export function useYMapItem<T>(ymap: Y.Map<T>, key: string) {
  const [data, setData] = useState<T>();

  const set = useCallback(
    (value: T) => {
      ymap.set(key, value);
    },
    [ymap, key]
  );

  useEffect(() => {
    function handle() {
   
      setData(ymap.get(key));
    }

    ymap.observe(handle);
    return () => ymap.unobserve(handle);
  }, [ymap, key]);

  return [data, set] as const;
}

export function useYArray<T>(name: string) {
  const { doc } = useYjs();
  const item = useMemo(() => doc.getArray<T>(name), [doc, name]);
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    function handle() {
      setData(item.toArray());
    }

    item.observe(handle);
    return () => item.unobserve(handle);
  }, [item]);

  return Object.assign(item, { data });
}

export function useYJson<T>(name: string) {
  const { doc } = useYjs();
  const [data, setData] = useState<T>();
  const item = useMemo(() => doc.getText(name), [doc, name]);

  const set = useCallback(
    (data: T) => item.insert(0, JSON.stringify(data)),
    [item]
  );

  useEffect(() => {
    function handle() {
      setData(JSON.parse(item.toJSON()));
    }

    item.observe(handle);
    return () => item.unobserve(handle);
  }, [item]);

  return Object.assign(item, { data, set });
}

export function useYText(name: string) {
  const { doc } = useYjs();
  const [data, setData] = useState<string>();
  const item = useMemo(() => doc.getText(name), [doc, name]);

  useEffect(() => {
    function handle() {
      setData(item.toString());
    }

    item.observe(handle);
    return () => item.unobserve(handle);
  }, [item]);

  return Object.assign(item, { data });
}
