import { reorganizePerIndex } from "lib";
import React from "react";
import { CompleteBlock, TPoint } from "schemas";
import { EdgesMarkers } from "./markers/edgesMarker";
import { GROUPWIDTH, PADDING } from "../const";

export type TEdge = {
  from: {
    blockId: string | undefined;
    groupId: string | undefined
    graphPosition: TPoint
  } | null;
  id: string;
  to: {
    blockId: string | undefined;
    groupId: string | undefined;
    graphPosition: TPoint 
   
  } | null;
};

let nouvelObjet = {
  createdAt: "", 
  description: "",
  graphPosition: {x:0,y:0},
  groupId: "",
  id: "banner",
  index: -1,
  pageId: "",
  title: "",
  type: "",
  updatedAt: "", 
  uuid: "UUID"
};

const Edges = React.memo(({ blocks }: { blocks: Partial<CompleteBlock>[] }) => {
  const data: TEdge[] = [];

  if (blocks.length) {
    const _blocksIndex = reorganizePerIndex(blocks);
    const _blocks = [nouvelObjet, ..._blocksIndex];

    for (let i = 0; i < _blocks.length - 1; i++) {
      const from = {
        blockId: _blocks[i].id,
        groupId: _blocks[i].id,
        graphPosition: _blocks[i].graphPosition ?? {
          x: (GROUPWIDTH + PADDING) * i - GROUPWIDTH,
          y: 210,
        },
      };
      const to = {
        blockId: _blocks[i + 1].id,
        groupId: _blocks[i + 1].id,
        graphPosition: _blocks[i + 1].graphPosition ?? {
          x: (GROUPWIDTH + PADDING) * (i + 1) - GROUPWIDTH,
          y: 220,
        },
      };
      const edge = { from, id: `edge_${i + 1}`, to };
      data.push(edge);
    }

    const lastBlock = _blocks[blocks.length - 1];

    const lastEdge = {
      from: {
        blockId: lastBlock.id,
        groupId: lastBlock.id,
        graphPosition: lastBlock.graphPosition as TPoint,
      },
      id: `edge_${_blocks.length}`,
      to: null,
    };
    data.push(lastEdge);
    return <EdgesMarkers edges={data} groups={_blocks} />;
  }

  return <></>;
});
export default Edges;
