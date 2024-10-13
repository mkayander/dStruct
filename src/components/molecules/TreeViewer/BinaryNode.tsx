import React from "react";

import { NodeBase } from "#/components/molecules/TreeViewer/NodeBase";
import { useNodeColors } from "#/hooks";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

export type BinaryNodeProps = TreeNodeData & {
  treeName: string;
  type: ArgumentTreeType;
};

export const BinaryNode: React.FC<BinaryNodeProps> = (props) => {
  const { color } = props;

  const { nodeColor, shadowColor } = useNodeColors(color);

  return (
    <NodeBase nodeColor={nodeColor} shadowColor={shadowColor} {...props} />
  );
};
