import { Box } from "@mui/material";
import React from "react";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { useBinaryTreePositioning } from "#/entities/dataStructures/binaryTree/hooks/useBinaryTreePositioning";
import { BinaryNode } from "#/entities/dataStructures/binaryTree/ui/BinaryNode";
import { GraphEdge } from "#/entities/dataStructures/graph/ui/GraphEdge";
import { GraphNode } from "#/entities/dataStructures/graph/ui/GraphNode";
import { LinkedListNode } from "#/entities/dataStructures/linkedList/ui/LinkedListNode";
import {
  selectMinXOffset,
  type TreeData,
} from "#/entities/dataStructures/node/model/nodeSlice";
import { useAppSelector } from "#/store/hooks";

const nodeComponentMap = {
  [ArgumentType.LINKED_LIST]: LinkedListNode,
  [ArgumentType.BINARY_TREE]: BinaryNode,
  [ArgumentType.GRAPH]: GraphNode,
};

type NodesViewProps = {
  treeName: string;
  data: TreeData;
  style?: React.CSSProperties;
  sx?: React.CSSProperties;
};

export const NodesView: React.FC<NodesViewProps> = ({
  treeName,
  data,
  style,
  sx,
}) => {
  const adjustXOffset = data.type === ArgumentType.LINKED_LIST;
  const offset = useAppSelector(selectMinXOffset(treeName, adjustXOffset)) ?? 0;

  useBinaryTreePositioning(treeName, data);

  const Node = nodeComponentMap[data.type];

  let left = Number(style?.left) || 0;
  left -= offset;

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        ...sx,
      }}
      style={{
        ...style,
        left,
        transition: "left 0.05s ease-in-out",
      }}
    >
      {Object.values(data.edges.entities).map(
        (edge) =>
          edge && <GraphEdge key={edge.id} treeName={treeName} {...edge} />,
      )}

      {Object.values(data.nodes.entities).map(
        (node) =>
          node && (
            <Node
              key={node.id}
              treeName={treeName}
              type={data.type}
              {...node}
            />
          ),
      )}
    </Box>
  );
};
