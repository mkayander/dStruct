import React from "react";

import { NodeBase } from "#/components/TreeViewer/NodeBase";
import { useBinaryChildNodes, useNodeColors } from "#/hooks";
import { type BinaryTreeNodeData } from "#/store/reducers/treeNodeReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

export type BinaryNodeProps = BinaryTreeNodeData & {
  treeName: string;
  type: ArgumentTreeType;
};

export const BinaryNode: React.FC<BinaryNodeProps> = (props) => {
  const { color } = props;

  const { nodeColor, shadowColor } = useNodeColors(color);

  const { relations } = useBinaryChildNodes(props, nodeColor);

  return (
    <NodeBase
      nodeColor={nodeColor}
      shadowColor={shadowColor}
      relations={relations}
      {...props}
    />
  );
};
