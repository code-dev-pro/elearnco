import { ObjectInspector, TableInspector } from "react-inspector";
import { GenericObject } from "schemas";
type TInspector = {
  isTable: boolean;
  data: GenericObject;
  name?: string;
  expandPaths?: string[];
};
export const Inspector = (props: TInspector) => {
  const { isTable, data, name = "Inspector", expandPaths = [] } = props;
  return (
    <div style={{zIndex:99999999}} className="fixed left-0 bottom-0 w-full overflow-scroll p-2 bg-black">
      <div className="relative w-full bg-foreground">
        {isTable ? (
          <TableInspector name={name} data={data} />
        ) : (
          <ObjectInspector expandPaths={expandPaths} name={name} data={data} />
        )}
      </div>
    </div>
  );
};
