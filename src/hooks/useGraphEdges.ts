"use client";

import { type RelationType } from "react-archer/lib/types";

import { type BinaryNodeProps } from "#/features/treeViewer/ui/BinaryNode";
import { useAppSelector } from "#/store/hooks";
import { selectNodeDataByIds } from "#/store/reducers/structures/treeNodeReducer";
import { processNodeRelation } from "#/utils";

export const useGraphEdges = (props: BinaryNodeProps, nodeColor: string) => {
  const { treeName, color, childrenIds } = props;
  const children =
    useAppSelector(selectNodeDataByIds(treeName, childrenIds)) ?? [];

  const relations: RelationType[] = [];
  for (const child of children) {
    processNodeRelation(relations, nodeColor, color, child);
  }

  return { relations };
};
