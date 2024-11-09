/**
 * Finds the centroid of a tree represented by an adjacency list.
 * The centroid is the node that, when removed, results in the largest remaining connected component being as small as possible.
 *
 * @param adjacencyList - A map representing the adjacency list of the tree, where the keys are node numbers and the values are arrays of neighboring node numbers.
 * @returns The node number of the centroid, or null if the tree is empty.
 */
export const findCentroid = (
  adjacencyList: Map<number, number[]>,
): number | null => {
  const nodeCount = adjacencyList.size;
  const size = new Map();
  const visited = new Set();
  let centroid = -1;
  let minMaxSize = nodeCount;

  function dfs(node: number) {
    if (visited.has(node)) {
      return 0;
    }

    visited.add(node);
    let totalSize = 1;
    let maxSize = 0;

    for (const neighbor of adjacencyList.get(node) ?? []) {
      if (visited.has(neighbor)) continue;

      const childSize = dfs(neighbor);
      totalSize += childSize;
      maxSize = Math.max(maxSize, childSize);
    }

    const restSize = nodeCount - totalSize;
    maxSize = Math.max(maxSize, restSize);

    if (maxSize < minMaxSize) {
      minMaxSize = maxSize;
      centroid = node;
    }

    size.set(node, totalSize);
    return totalSize;
  }

  const startNode = adjacencyList.keys().next().value!;
  dfs(startNode);

  return centroid;
};
