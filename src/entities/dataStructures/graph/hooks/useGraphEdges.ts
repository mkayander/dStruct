"use client";

import { type RelationType } from "react-archer/lib/types";

import { type BinaryNodeProps } from "#/entities/dataStructures/binaryTree/ui/BinaryNode";
import { selectNodeDataByIds } from "#/entities/dataStructures/node/model/nodeSlice";
import { useAppSelector } from "#/store/hooks";
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
