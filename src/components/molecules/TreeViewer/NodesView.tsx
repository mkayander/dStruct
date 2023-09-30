import { Box } from "@mui/material";
import React from "react";

import { BinaryNode } from "#/components/molecules/TreeViewer/BinaryNode";
import { LinkedListNode } from "#/components/molecules/TreeViewer/LinkedListNode";
import { useAppSelector } from "#/store/hooks";
import {
  selectMinXOffset,
  type TreeData,
} from "#/store/reducers/structures/treeNodeReducer";
import { ArgumentType } from "#/utils/argumentObject";

type NodesViewProps = {
  treeName: string;
  data: TreeData;
  style?: React.CSSProperties;
};

export const NodesView: React.FC<NodesViewProps> = ({
  treeName,
  data,
  style,
}) => {
  const adjustXOffset = data.type === ArgumentType.LINKED_LIST;
  const offset = useAppSelector(selectMinXOffset(treeName, adjustXOffset)) ?? 0;

  const Node =
    data.type === ArgumentType.BINARY_TREE ? BinaryNode : LinkedListNode;

  let left = Number(style?.left) ?? 0;
  left -= offset;

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      style={{
        ...style,
        left,
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
          ),
      )}
    </Box>
  );
};
