import React from "react";

import type { ArgumentTreeType } from "#/entities/argument/model/types";
import { useLinkedListChildNode, useNodeColors } from "#/hooks";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";

import { NodeBase } from "./NodeBase";

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
