import React from "react";
import { CompleteBlock } from "schemas";
import Block from "./block";

const Blocks = React.memo(
    ({
      graphScale,
      blocks,
      banner
     
    }: {
      graphScale: number;
      blocks: Partial<CompleteBlock>[];
      banner:string
     
    }) =>  {
     return <>
       <Block banner={banner} {...{index:-1,title:'Banner',id:'banner'}} graphScale={graphScale} />
      { blocks?.map(
        (block: Partial<CompleteBlock>) =>
          <Block banner={null} type={block.type}  key={block.id} {...block} graphScale={graphScale} />
      )}</>
    }
  );

  export default Blocks