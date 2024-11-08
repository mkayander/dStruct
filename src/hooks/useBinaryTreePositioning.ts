import { useEffect } from "react";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { useAppDispatch } from "#/store/hooks";
import {
  type TreeData,
  type TreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/structures/treeNodeReducer";

const TOP_OFFSET = 25;

export const useBinaryTreePositioning = (
  treeName: string,
  treeData: TreeData,
) => {
  const dispatch = useAppDispatch();

  const rootNode =
    (treeData.rootId && treeData.nodes.entities[treeData.rootId]) || null;

  const maxDepth = treeData.maxDepth ?? 0;
  const treeSizeCoefficient = (maxDepth < 2 ? 2 : maxDepth) ** 2;

  const updateChildPosition = (
    id: string,
    parentData: TreeNodeData,
    isLeft: boolean,
    visited: Set<string>,
  ) => {
    if (visited.has(id)) return;
    visited.add(id);
    if (id === treeData.rootId) return;
    const childData = treeData.nodes.entities[id];
    if (!childData) return;

    const verticalOffset = 50;
    let horizontalOffset = 15 * treeSizeCoefficient;
    horizontalOffset /= parentData.depth * 2.1 || 1;

    const newY = parentData.y + verticalOffset;
    const newX = isLeft
      ? parentData.x - horizontalOffset
      : parentData.x + horizontalOffset;

    if (childData.y !== newY || childData.x !== newX) {
      dispatch(
        treeNodeSlice.actions.update({
          name: treeName,
          data: {
            id: childData.id,
            changes: {
              y: newY,
              x: newX,
            },
          },
        }),
      );
    }

    const [leftId, rightId] = childData.childrenIds;
    if (leftId) {
      updateChildPosition(leftId, childData, true, visited);
    }
    if (rightId) {
      updateChildPosition(rightId, childData, false, visited);
    }
  };

  useEffect(() => {
    if (treeData.type !== ArgumentType.BINARY_TREE || !rootNode) return;

    const newRootX = 25 * treeSizeCoefficient + maxDepth ** 2.8;
    if (rootNode.x !== newRootX) {
      dispatch(
        treeNodeSlice.actions.update({
          name: treeName,
          data: {
            id: rootNode.id,
            changes: { x: newRootX, y: TOP_OFFSET },
          },
        }),
      );
    }

    const [leftId, rightId] = rootNode.childrenIds;
    const visited = new Set<string>();
    if (leftId) {
      updateChildPosition(leftId, rootNode, true, visited);
    }
    if (rightId) {
      updateChildPosition(rightId, rootNode, false, visited);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    maxDepth,
    rootNode?.id,
    treeName,
    treeData,
    treeSizeCoefficient,
  ]);
};
