/**
 * The base radius used for positioning snowflake nodes in a graph.
 * This value serves as the foundational distance from the center
 * for calculating the positions of nodes in a snowflake pattern.
 */
const RADIUS_BASE = 80;

/**
 * Represents an item in the queue used for positioning snowflake nodes.
 *
 * @typedef {Object} QueueItem
 * @property {number} node - The identifier of the node.
 * @property {number} parentX - The X coordinate of the parent node.
 * @property {number} parentY - The Y coordinate of the parent node.
 * @property {number} parentAngle - The angle of the parent node.
 */
type QueueItem = {
  node: number;
  parentX: number;
  parentY: number;
  parentAngle: number;
};

/**
 * Positions nodes in a snowflake-like structure based on an adjacency list.
 *
 * @param adjacencyList - A map where the key is a node and the value is an array of child nodes.
 * @param nodeMap - A map where the key is a node and the value is an object containing x and y coordinates.
 * @param startingNode - The node from which to start positioning.
 * @param centerX - The x-coordinate of the starting node.
 * @param centerY - The y-coordinate of the starting node.
 *
 * The function uses a breadth-first search (BFS) approach to position nodes in a radial manner,
 * starting from the `startingNode` at the given `centerX` and `centerY` coordinates. Each level
 * of the BFS increases the radius, and child nodes are positioned around their parent node
 * based on an angle step that creates a cone or circular shape.
 */
export const positionSnowflakeNodes = (
  adjacencyList: Map<number, number[]>,
  nodeMap: Map<number, { x: number; y: number }>,
  startingNode: number,
  centerX: number,
  centerY: number,
) => {
  let queue: QueueItem[] = [
    {
      node: startingNode,
      parentX: centerX,
      parentY: centerY,
      parentAngle: 0,
    },
  ];

  let level = 0;
  const visited = new Set<number>([startingNode]);

  while (queue.length > 0) {
    level++;
    const nextQueue: QueueItem[] = [];
    for (const { node, parentX, parentY, parentAngle } of queue) {
      const radius = RADIUS_BASE + RADIUS_BASE / level; // Increase radius based on level
      const children = adjacencyList.get(node) ?? []; // Get children from adjacency list

      let angleStep = Math.PI / 3 / Math.max(children.length, 1); // Adjust the angle step to create a "cone" shape
      let startAngle = parentAngle - (angleStep * (children.length - 1)) / 2; // Start angle to center around the parent's angle

      if (node === startingNode) {
        angleStep = (2 * Math.PI) / (children.length || 1); // Evenly distribute around a circle
        startAngle = 0; // Start angle for the centroid
      }

      children.forEach((child, childIndex) => {
        if (visited.has(child)) return;
        visited.add(child);

        // Calculate angle for the child node based on the parent's angle and child index
        const angle = startAngle + childIndex * angleStep; // Spread children around the parent's angle
        const x = parentX + radius * Math.cos(angle);
        const y = parentY + radius * Math.sin(angle);

        const childData = nodeMap.get(child);
        if (childData && childData.x === 0 && childData.y === 0) {
          childData.x = x;
          childData.y = y;
        }

        nextQueue.push({
          node: child,
          parentX: x,
          parentY: y,
          parentAngle: angle,
        });
      });
    }

    queue = nextQueue;
  }
};
