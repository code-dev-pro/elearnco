import { nanoid } from "lib/utils";
import React from "react";

import QcUI from "./QcUI";
import { TextBlockType } from "schemas";

const mockData = {
  data: [
    {
      id: nanoid(7),
      content: "content 1",
      editable: false,
      isGood: false,
    },
    {
      id: nanoid(7),
      content: "content 2",
      editable: false,
      isGood: false,
    },
  ],
  type: "lower-roman",
  isRandom: false,
};
export const QcModule = (props: {
  type: string;
  isReadOnly?: boolean;
  onChange: (data: any) => void;
  content: any;
}) => {
  const { type = TextBlockType.PARAGRAH, isReadOnly = false, onChange, content } = props;

  return (
    <QcUI
      data={content ? content : mockData}
      isReadOnly={isReadOnly}
      onChange={onChange}
    />
  );
};

export default QcModule;
