import { Box, type SxProps } from "@mui/material";
import React from "react";

import { BinaryNode } from "#/components/TreeViewer/BinaryNode";
import { LinkedListNode } from "#/components/TreeViewer/LinkedListNode";
import { useNodesRuntimeUpdates } from "#/hooks";
import {
  type TreeData,
  treeNodeSlice,
} from "#/store/reducers/structures/treeNodeReducer";
import { ArgumentType } from "#/utils/argumentObject";

type NodesViewProps = {
  treeName: string;
  data: TreeData;
  playbackInterval: number;
  replayCount: number;
  sx?: SxProps;
};

export const NodesView: React.FC<NodesViewProps> = ({
  treeName,
  data,
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

  const Node =
    data.type === ArgumentType.BINARY_TREE ? BinaryNode : LinkedListNode;

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        ...sx,
      }}
    >
      {Object.values(data.nodes.entities).map(
        (node) =>
          node && (
            <Node
              key={node.id}
              treeName={treeName}
              type={data.type}
              {...node}
            />
          )
      )}
    </Box>
  );
};
