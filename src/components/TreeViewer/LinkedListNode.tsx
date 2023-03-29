import React from "react";

import { NodeBase } from "#/components/TreeViewer/NodeBase";
import { useLinkedListChildNode, useNodeColors } from "#/hooks";
import { type BinaryTreeNodeData } from "#/store/reducers/treeNodeReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

export type LinkedListProps = BinaryTreeNodeData & {
  treeName: string;
  type: ArgumentTreeType;
};

export const LinkedListNode: React.FC<LinkedListProps> = (props) => {
  const { color } = props;

  const { nodeColor, shadowColor } = useNodeColors(color);

  const { relations } = useLinkedListChildNode(props, nodeColor);

  return (
    <NodeBase
      nodeColor={nodeColor}
      shadowColor={shadowColor}
      relations={relations}
      {...props}
    />
  );
};
