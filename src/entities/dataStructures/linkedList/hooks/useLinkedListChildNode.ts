"use client";

import { useEffect } from "react";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { type BinaryNodeProps } from "#/entities/dataStructures/binaryTree/ui/BinaryNode";
import {
  selectNodeDataById,
  type TreeNodeData,
  treeNodeSlice,
} from "#/entities/dataStructures/node/model/nodeSlice";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

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
