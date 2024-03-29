import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { TPoint } from "schemas";

export type Endpoint = {
  id: string;
  position: TPoint;
};
export const endpointsContext = createContext<{
  sourceEndpointYOffsets: Map<string, Endpoint>;
  setSourceEndpointYOffset?: (endpoint: Endpoint) => void;
  deleteSourceEndpointYOffset?: (endpointId: string) => void;
  targetEndpointYOffsets: Map<string, Endpoint>;
  setTargetEnpointYOffset?: (endpoint: Endpoint) => void;
}>({
  sourceEndpointYOffsets: new Map(),
  targetEndpointYOffsets: new Map(),
});

export const EndpointsProvider = ({ children }: { children: ReactNode }) => {
  const [sourceEndpointYOffsets, setSourceEndpoints] = useState<
    Map<string, Endpoint>
  >(new Map());
  const [targetEndpointYOffsets, setTargetEndpoints] = useState<
    Map<string, Endpoint>
  >(new Map());

  const setSourceEndpointYOffset = useCallback((endpoint: Endpoint):void  => {
    setSourceEndpoints((endpoints) =>
      new Map(endpoints).set(endpoint.id, endpoint)
    );
  }, []);

 

  const deleteSourceEndpointYOffset = useCallback((endpointId: string):void => {
    setSourceEndpoints((endpoints) => {
      endpoints.delete(endpointId);
      return endpoints;
    });
  }, []);

  const setTargetEnpointYOffset = useCallback((endpoint: Endpoint):void  => {
 
    setTargetEndpoints((endpoints) =>
      new Map(endpoints).set(endpoint.id, endpoint)
    );
  }, []);

  return (
    <endpointsContext.Provider
      value={{
        sourceEndpointYOffsets,
        targetEndpointYOffsets,
        setSourceEndpointYOffset,
        deleteSourceEndpointYOffset,
        setTargetEnpointYOffset,
      }}
    >
      {children}
    </endpointsContext.Provider>
  );
};

export const useEndpoints = () => useContext(endpointsContext);
