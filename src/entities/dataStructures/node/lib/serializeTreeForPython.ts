import type {
  TreeData,
  TreeNodeData,
} from "#/entities/dataStructures/node/model/nodeSlice";

export type TrackedBinaryTreePythonPayload = {
  levelOrder: Array<number | string | null>;
  nodeIds: Array<string | null>;
  treeName: string;
};

export type TrackedLinkedListPythonPayload = {
  values: Array<number | string | null>;
  nodeIds: string[];
  treeName: string;
};

function trimTrailingNullPairs(
  values: Array<number | string | null>,
  nodeIds: Array<string | null>,
): void {
  while (
    values.length > 0 &&
    values[values.length - 1] === null &&
    nodeIds.length > 0 &&
    nodeIds[nodeIds.length - 1] === null
  ) {
    values.pop();
    nodeIds.pop();
  }
}

/**
 * Level-order values + parallel Redux node ids for the same BFS layout the Python
 * `build_tree` harness uses, so visualization frames target real node entities.
 */
export function serializeBinaryTreeLevelOrderWithIds(
  treeData: TreeData | undefined,
  treeName: string,
): TrackedBinaryTreePythonPayload | null {
  if (!treeData?.rootId) return null;

  let dataMap = treeData.nodes.entities;
  if (treeData.initialNodes !== null) {
    dataMap = treeData.initialNodes.entities;
  }

  const rootNode = dataMap[treeData.rootId];
  if (!rootNode) return null;

  const levelOrder: Array<number | string | null> = [];
  const nodeIds: Array<string | null> = [];

  levelOrder.push(rootNode.value ?? null);
  nodeIds.push(rootNode.id);

  const queue: TreeNodeData[] = [rootNode];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) continue;

    const leftId = node.childrenIds[0];
    const rightId = node.childrenIds[1];

    const leftChild = leftId ? dataMap[leftId] : undefined;
    const rightChild = rightId ? dataMap[rightId] : undefined;

    levelOrder.push(leftChild?.value ?? null);
    nodeIds.push(leftChild?.id ?? null);

    levelOrder.push(rightChild?.value ?? null);
    nodeIds.push(rightChild?.id ?? null);

    if (leftChild) queue.push(leftChild);
    if (rightChild) queue.push(rightChild);
  }

  trimTrailingNullPairs(levelOrder, nodeIds);

  return { levelOrder, nodeIds, treeName };
}

/**
 * Walks the linked-list chain (childrenIds[0]) and returns parallel values + ids.
 */
export function serializeLinkedListWithIds(
  treeData: TreeData | undefined,
  treeName: string,
): TrackedLinkedListPythonPayload | null {
  if (!treeData?.rootId) return null;

  let dataMap = treeData.nodes.entities;
  if (treeData.initialNodes !== null) {
    dataMap = treeData.initialNodes.entities;
  }

  const values: Array<number | string | null> = [];
  const nodeIds: string[] = [];

  let currentId: string | null | undefined = treeData.rootId;
  while (currentId) {
    const node: TreeNodeData | undefined = dataMap[currentId];
    if (!node) break;
    values.push(node.value ?? null);
    nodeIds.push(node.id);
    currentId = node.childrenIds[0];
  }

  if (values.length === 0) return null;

  return { values, nodeIds, treeName };
}
