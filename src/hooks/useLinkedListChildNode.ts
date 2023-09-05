"use client";

import { useEffect } from "react";
import { type RelationType } from "react-archer/lib/types";

import { type BinaryNodeProps } from "#/components/molecules/TreeViewer/BinaryNode";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  selectNodeDataById,
  type TreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/structures/treeNodeReducer";
import { processNodeRelation } from "#/utils";

export const useLinkedListChildNode = (
  props: BinaryNodeProps,
  nodeColor: string
) => {
  const { treeName, color, childrenIds, y, x } = props;
  const [nextId] = childrenIds;
  const dispatch = useAppDispatch();
  const nextNodeData = useAppSelector(
    selectNodeDataById(treeName, nextId ?? "")
  );

  const relations: RelationType[] = [];
  processNodeRelation(relations, nodeColor, color, nextNodeData);

  const updateChildPosition = (data?: TreeNodeData | null) => {
    if (!data) return;

    const horizontalOffset = 64;

    dispatch(
      treeNodeSlice.actions.update({
        name: treeName,
        data: {
          id: data.id,
          changes: {
            y: y,
            x: x + horizontalOffset,
          },
        },
      })
    );
  };

  useEffect(() => {
    updateChildPosition(nextNodeData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextId, x, y]);

  return { relations };
};
