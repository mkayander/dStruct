import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { type AppDispatch } from "#/store/makeStore";
import { type TreeData } from "#/store/reducers/structures/treeNodeReducer";
import { type ArgumentObject, ArgumentType } from "#/utils/argumentObject";

export const createRuntimeTree = (
  nodesData: TreeData | undefined,
  arg: ArgumentObject,
  dispatch: AppDispatch
) => {
  if (!nodesData) {
    console.error("No nodes data found for binary tree: ", name);
    return null;
  }
  const rootId = nodesData.rootId;
  if (!rootId) return null;

  let dataMap = nodesData.nodes.entities;
  if (nodesData.initialNodes.ids.length > 0) {
    dataMap = nodesData.initialNodes.entities;
  }

  const rootData = dataMap[rootId];

  switch (nodesData.type) {
    case ArgumentType.BINARY_TREE:
      return BinaryTreeNode.fromNodeData(arg.name, rootData, dataMap, dispatch);

    case ArgumentType.LINKED_LIST:
      return LinkedListNode.fromNodeData(arg.name, rootData, dataMap, dispatch);
  }
};
