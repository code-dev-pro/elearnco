import React from "react";
import { CompleteBlock } from "schemas";

import BlockNodeModule from "./BlockNodeModule";

const BlockNodeContentUI = React.memo((props: Partial<CompleteBlock>) => {
  return <BlockNodeModule type={props.type} ino={props.uuid} id={props.id} />
});
BlockNodeContentUI.displayName = "BlocNodeContentUI";
export default BlockNodeContentUI;
