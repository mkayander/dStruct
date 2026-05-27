import React from "react";

import type { ArgumentTreeType } from "#/entities/argument/model/types";
import { type TreeNodeData } from "#/entities/dataStructures/node/model/nodeSlice";
import { NodeBase } from "#/features/treeViewer/ui/NodeBase";
import { useNodeColors } from "#/shared/hooks";

import { useLinkedListChildNode } from "../hooks";

export type LinkedListProps = TreeNodeData & {
  treeName: string;
  type: ArgumentTreeType;
};

export const LinkedListNode: React.FC<LinkedListProps> = (props) => {
  const { color } = props;

  const { nodeColor, shadowColor } = useNodeColors(color);
  useLinkedListChildNode(props);

  return (
    <NodeBase nodeColor={nodeColor} shadowColor={shadowColor} {...props} />
  );
};
