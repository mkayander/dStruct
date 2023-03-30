import { useEffect } from "react";
import { type RelationType } from "react-archer/lib/types";

import { type BinaryNodeProps } from "#/components/TreeViewer/BinaryNode";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  selectNamedTreeMaxDepth,
  selectNodeDataById,
  type TreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";
import { processNodeRelation } from "#/utils";

export const useBinaryChildNodes = (
  props: BinaryNodeProps,
  nodeColor: string
) => {
  const { id, treeName, color, childrenIds, depth, y, x } = props;
  const [leftId, rightId] = childrenIds;
  const dispatch = useAppDispatch();
  const maxDepth = useAppSelector(selectNamedTreeMaxDepth(treeName)) ?? 0;
  const leftData = useAppSelector(selectNodeDataById(treeName, leftId ?? ""));
  const rightData = useAppSelector(selectNodeDataById(treeName, rightId ?? ""));

  const relations: RelationType[] = [];

  processNodeRelation(relations, nodeColor, color, leftData);
  processNodeRelation(relations, nodeColor, color, rightData);

  const treeSizeCoefficient = (maxDepth < 2 ? 2 : maxDepth) ** 2;

  const updateChildPosition = (
    data?: TreeNodeData | null,
    isLeft?: boolean
  ) => {
    if (!data) return;

    const verticalOffset = 50;
    let horizontalOffset = 15 * treeSizeCoefficient;
    horizontalOffset /= depth * 2.1 || 1;

    dispatch(
      treeNodeSlice.actions.update({
        name: treeName,
        data: {
          id: data.id,
          changes: {
            y: y + verticalOffset,
            x: isLeft ? x - horizontalOffset : x + horizontalOffset,
          },
        },
      })
    );
  };

  useEffect(() => {
    if (depth === 0) {
      dispatch(
        treeNodeSlice.actions.update({
          name: treeName,
          data: {
            id,
            changes: { x: 25 * treeSizeCoefficient + maxDepth ** 2.8 },
          },
        })
      );
    }
  }, [depth, dispatch, maxDepth, id, treeName, treeSizeCoefficient]);

  useEffect(() => {
    updateChildPosition(leftData, true);
    updateChildPosition(rightData, false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftId, rightId, x, y]);

  return { relations };
};
