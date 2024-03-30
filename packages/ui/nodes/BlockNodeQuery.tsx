import React from "react";
import { CompleteBlock } from "schemas";

import BlockNodeModule from "./BlockNodeModule";
const BlockNodeQuery = (props: Partial<CompleteBlock>) => {
  const { uuid,type } = props;

  return <BlockNodeModule ino={uuid as string} type={type as string} />;
  
};


export default BlockNodeQuery;
