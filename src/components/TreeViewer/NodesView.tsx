import { Box, type SxProps } from "@mui/material";
import type { EntityState } from "@reduxjs/toolkit";
import React from "react";

import { BinaryNode } from "#/components/TreeViewer/BinaryNode";
import { LinkedListNode } from "#/components/TreeViewer/LinkedListNode";
import { useNodesRuntimeUpdates } from "#/hooks";
import {
  type TreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/structures/treeNodeReducer";
import { type ArgumentTreeType, ArgumentType } from "#/utils/argumentObject";

type NodesViewProps = {
  treeName: string;
  type: ArgumentTreeType;
  nodes: EntityState<TreeNodeData>;
  playbackInterval: number;
  replayCount: number;
  sx?: SxProps;
};

export const NodesView: React.FC<NodesViewProps> = ({
  treeName,
  type,
  nodes,
  playbackInterval,
  replayCount,
  sx,
}) => {
  useNodesRuntimeUpdates(
    treeName,
    treeNodeSlice,
    playbackInterval,
    replayCount
  );

  const Node = type === ArgumentType.BINARY_TREE ? BinaryNode : LinkedListNode;

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        ...sx,
      }}
    >
      {Object.values(nodes.entities).map(
        (node) =>
          node && (
            <Node key={node.id} treeName={treeName} type={type} {...node} />
          )
      )}
    </Box>
  );
};
