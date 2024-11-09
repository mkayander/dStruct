import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";
import { BinaryTreeNode } from "#/entities/dataStructures/binaryTree/model/binaryTreeNode";
import { LinkedListNode } from "#/entities/dataStructures/linkedList/model/linkedListNode";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";

import type { TreeData } from "../model/nodeSlice";

export const createRuntimeTree = (
  nodesData: TreeData | undefined,
  arg: ArgumentObject,
  callstack: CallstackHelper,
) => {
  if (!nodesData) {
    console.error("No nodes data found for binary tree");
    return null;
  }
  const rootId = nodesData.rootId;
  if (!rootId) return null;

  let dataMap = nodesData.nodes.entities;
  if (nodesData.initialNodes !== null) {
    dataMap = nodesData.initialNodes.entities;
  }

  const rootData = dataMap[rootId];

  switch (nodesData.type) {
    case ArgumentType.BINARY_TREE:
      return BinaryTreeNode.fromNodeData(
        arg.name,
        rootData,
        dataMap,
        callstack,
      );

    case ArgumentType.LINKED_LIST:
      return LinkedListNode.fromNodeData(
        arg.name,
        rootData,
        dataMap,
        callstack,
      );
  }
};
