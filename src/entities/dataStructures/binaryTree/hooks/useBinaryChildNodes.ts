"use client";

import { type RelationType } from "react-archer/lib/types";

import { type BinaryNodeProps } from "#/entities/dataStructures/binaryTree/ui/BinaryNode";
import { selectNodeDataById } from "#/entities/dataStructures/node/model/nodeSlice";
import { useAppSelector } from "#/store/hooks";
import { processNodeRelation } from "#/utils";

export const useBinaryChildNodes = (
  props: BinaryNodeProps,
  nodeColor: string,
) => {
  const { treeName, color, childrenIds } = props;
  const [leftId, rightId] = childrenIds;
  const leftData = useAppSelector(selectNodeDataById(treeName, leftId ?? ""));
  const rightData = useAppSelector(selectNodeDataById(treeName, rightId ?? ""));

  const relations: RelationType[] = [];

  processNodeRelation(relations, nodeColor, color, leftData);
  processNodeRelation(relations, nodeColor, color, rightData);

  return { relations };
};
