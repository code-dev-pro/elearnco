import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { TPoint } from "schemas";
export const graphPositionDefaultValue = (firstGroupCoordinates: TPoint) => ({
  x: firstGroupCoordinates.x,
  y: firstGroupCoordinates.y,
  scale: 1,
});

type Position = TPoint & { scale: number };

const graphContext = createContext<{
  graphPosition: Position;
  setGraphPosition: Dispatch<SetStateAction<Position>>;
  openedBlockId?: string;
  setOpenedBlockId: Dispatch<SetStateAction<string | undefined>>;
  kindOfVue: TkindOfVue;
  setkindOfVue: Dispatch<SetStateAction<string | undefined>>;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
}>({
  graphPosition: graphPositionDefaultValue({ x: 0, y: 0 }),
});

type TkindOfVue = "page" | "block";

export const GraphProvider = ({
  children,
  isReadOnly = false,
  isAnalytics = false,
}: {
  children: ReactNode;
  isReadOnly?: boolean;
  isAnalytics?: boolean;
}) => {
  const [graphPosition, setGraphPosition] = useState(
    graphPositionDefaultValue({ x: 400, y: 0 })
  );

  const [openedBlockId, setOpenedBlockId] = useState<string>();
  const [kindOfVue, setkindOfVue] = useState<TkindOfVue>("block");

  return (
    <graphContext.Provider
      value={{
        graphPosition,
        setGraphPosition,
        openedBlockId,
        setOpenedBlockId,
        kindOfVue,
        setkindOfVue,
      }}
    >
      {children}
    </graphContext.Provider>
  );
};

export const useGraph = () => useContext(graphContext);
