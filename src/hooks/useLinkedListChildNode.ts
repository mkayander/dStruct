"use client";

import { useEffect } from "react";

import { type BinaryNodeProps } from "#/components/molecules/TreeViewer/BinaryNode";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  selectNodeDataById,
  type TreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/structures/treeNodeReducer";
import { ArgumentType } from "#/utils/argumentObject";

export const useLinkedListChildNode = (props: BinaryNodeProps) => {
  const { treeName, childrenIds, y, x } = props;
  const [nextId] = childrenIds;
  const dispatch = useAppDispatch();
  const nextNodeData = useAppSelector(
    selectNodeDataById(treeName, nextId ?? ""),
  );

  const updateChildPosition = (data?: TreeNodeData | null) => {
    if (!data || data.argType !== ArgumentType.LINKED_LIST) return;

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
      }),
    );
  };

  useEffect(() => {
    updateChildPosition(nextNodeData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextId, x, y]);
};
