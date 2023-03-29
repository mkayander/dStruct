import React from "react";

import { NodeBase } from "#/components/TreeViewer/NodeBase";
import { useChildNodes, useNodeColors } from "#/hooks";
import { type BinaryTreeNodeData } from "#/store/reducers/treeNodeReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

export type LinkedListProps = BinaryTreeNodeData & {
  treeName: string;
  type: ArgumentTreeType;
};

export const LinkedList: React.FC<LinkedListProps> = (props) => {
  const { color } = props;

  const { nodeColor, shadowColor } = useNodeColors(color);

  const { relations } = useChildNodes(props, nodeColor);

  return (
    <NodeBase
      nodeColor={nodeColor}
      shadowColor={shadowColor}
      relations={relations}
      {...props}
    />
  );
};
