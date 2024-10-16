import React from "react";

import { NodeBase } from "#/components/molecules/TreeViewer/NodeBase";
import { useLinkedListChildNode, useNodeColors } from "#/hooks";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

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
