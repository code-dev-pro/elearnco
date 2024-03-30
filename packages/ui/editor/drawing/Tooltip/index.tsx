import { Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import { TTooltip } from "../types";

const Tooltip = (props: TTooltip) => {
  const { defaultValue, bounds, onChange } = props;

  const [value, setValue] = useState<string>(defaultValue);

  const _onChange = (str: string): void => {
    onChange?.(str);
    setValue(str);
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className="absolute overflow-hidden bg-default-50 rounded-xl"
      style={{
        minWidth: 200,
        padding: 15,
        height: 200,
        zIndex: 99999999,

        left: bounds?.minX + (bounds?.maxX - bounds?.minX) / 2 - 200 / 2 || 0,
        top: bounds?.minY  || 0,
      }}
    >
      <Textarea
        minRows={7}
        maxRows={7}
        value={value}
        placeholder="Write your text..."
        onValueChange={_onChange}
      />
    </div>
  );
};

export default Tooltip;
