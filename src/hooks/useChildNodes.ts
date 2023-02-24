import { alpha } from "@mui/material";
import { useEffect } from "react";
import { type RelationType } from "react-archer/lib/types";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  type BinaryTreeNodeData,
  selectNodeDataById,
  selectTreeMaxDepth,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";

const relationProps = {
  targetAnchor: "middle",
  sourceAnchor: "middle",
} as const;

export const useChildNodes = (
  leftId: string | undefined,
  rightId: string | undefined,
  color: string | undefined,
  nodeColor: string,
  x: number,
  y: number,
  depth: number
) => {
  const dispatch = useAppDispatch();
  const maxDepth = useAppSelector(selectTreeMaxDepth);
  const leftData = useAppSelector(selectNodeDataById(leftId ?? ""));
  const rightData = useAppSelector(selectNodeDataById(rightId ?? ""));

  const relations: RelationType[] = [];

  const processNode = (data?: BinaryTreeNodeData) => {
    if (!data) return;

    const linkColor =
      data?.color && color === data.color ? alpha(nodeColor, 0.4) : undefined;

    if (data.id && relations[0]?.targetId !== data.id) {
      relations.push({
        ...relationProps,
        targetId: data.id,
        style: { strokeColor: linkColor },
      });
    }
  };

  processNode(leftData);
  processNode(rightData);

  const updateChildPosition = (data?: BinaryTreeNodeData, isLeft?: boolean) => {
    if (!data) return;

    const verticalOffset = 50;
    let horizontalOffset = 15 * (maxDepth < 2 ? 2 : maxDepth) ** 2;
    horizontalOffset /= depth * 2 || 1;

    dispatch(
      treeNodeSlice.actions.update({
        id: data.id,
        changes: {
          y: y + verticalOffset,
          x: isLeft ? x - horizontalOffset : x + horizontalOffset,
        },
      })
    );
  };

  useEffect(() => {
    updateChildPosition(leftData, true);
    updateChildPosition(rightData, false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftId, rightId, x, y]);

  return { relations };
};
