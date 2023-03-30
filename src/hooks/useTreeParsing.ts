import { useEffect } from "react";
import uuid4 from "short-uuid";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import {
  caseSlice,
  selectCaseArguments,
  selectCaseArgumentsInfo,
} from "#/store/reducers/caseReducer";
import {
  treeDataSelector,
  type TreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";
import { isNumber } from "#/utils";
import {
  type ArgumentObject,
  ArgumentType,
  isArgumentTreeType,
} from "#/utils/argumentObject";

export type TreeInput = (number | null)[];

const createNodeData = (
  map: Record<string, TreeNodeData>,
  value: number | undefined | null,
  depth: number
) => {
  if (!isNumber(value)) return;

  const newId = uuid4.generate();
  map[newId] = {
    id: newId,
    value: value,
    depth,
    x: 0,
    y: 0,
    childrenIds: [],
  };

  return map[newId];
};

const parseBinaryTreeArgument = (rawInput: string) => {
  let input: TreeInput | null = null;
  try {
    input = JSON.parse(rawInput);
  } catch (e) {
    console.warn(e);
  }

  if (!input || input.length === 0) return;

  const nodesMap: Record<string, TreeNodeData> = {};

  const rootNum = input[0];
  if (!isNumber(rootNum)) return;

  const rootData = createNodeData(nodesMap, rootNum, 0);
  if (!rootData) return;

  const queue: TreeNodeData[] = [rootData];

  let maxDepth = 0;

  let i = 1;

  while (queue.length > 0 && i < input.length) {
    const current = queue.shift();
    if (!current) break;

    const newDepth = current.depth + 1;

    maxDepth = newDepth;

    const newLeft = createNodeData(nodesMap, input[i], newDepth);
    if (newLeft) {
      current.childrenIds[0] = newLeft.id;
      queue.push(newLeft);
    }
    i++;

    const newRight = createNodeData(nodesMap, input[i], newDepth);
    if (newRight) {
      current.childrenIds[1] = newRight.id;
      queue.push(newRight);
    }
    i++;
  }

  return { maxDepth, nodesMap };
};

const parseLinkedListArgument = (rawInput: string) => {
  let input: TreeInput | null = null;
  try {
    input = JSON.parse(rawInput);
  } catch (e) {
    console.warn(e);
  }

  if (!input || input.length === 0) return;

  const nodesMap: Record<string, TreeNodeData> = {};

  let prevNode: TreeNodeData | null = null;
  let maxDepth = 0;

  for (const value of input) {
    if (!isNumber(value)) continue;

    const newNode = createNodeData(nodesMap, value, 0);
    if (!newNode) continue;

    if (prevNode) {
      prevNode.childrenIds[0] = newNode.id;
    }

    prevNode = newNode;
    maxDepth++;
  }

  return { maxDepth, nodesMap };
};

const parseArgument = (arg: ArgumentObject) => {
  switch (arg.type) {
    case ArgumentType.BINARY_TREE:
      return parseBinaryTreeArgument(arg.input);
    case ArgumentType.LINKED_LIST:
      return parseLinkedListArgument(arg.input);
    default:
      return;
  }
};

export const useTreeParsing = () => {
  const dispatch = useAppDispatch();

  const args = useAppSelector(selectCaseArguments);
  const argsInfo = useAppSelector(selectCaseArgumentsInfo);
  const treeData = useAppSelector(treeDataSelector);

  useEffect(() => {
    const removedTrees = new Set<string>(Object.keys(treeData));
    for (const arg of args) {
      if (!isArgumentTreeType(arg.type)) continue;

      removedTrees.delete(arg.name);
      if (argsInfo[arg.name]?.isParsed) continue;

      dispatch(
        treeNodeSlice.actions.clear({
          name: arg.name,
        })
      );

      const parsed = parseArgument(arg);
      if (!parsed) continue;

      dispatch(
        treeNodeSlice.actions.init({
          name: arg.name,
          type: arg.type,
          order: arg.order,
        })
      );
      dispatch(
        treeNodeSlice.actions.addMany({
          name: arg.name,
          data: {
            maxDepth: parsed.maxDepth,
            nodes: Object.values(parsed.nodesMap),
          },
        })
      );
      dispatch(
        caseSlice.actions.setIsArgumentParsed({ name: arg.name, value: true })
      );
    }

    for (const name of removedTrees) {
      dispatch(treeNodeSlice.actions.clear({ name }));
    }

    dispatch(callstackSlice.actions.removeAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args, argsInfo, dispatch]);
};
