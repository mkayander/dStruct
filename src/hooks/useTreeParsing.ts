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
  type BinaryTreeNodeData,
  treeDataSelector,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";
import { isNumber } from "#/utils";

// [3,9,20,null,null,15,7]

export type BinaryTreeInput = (number | null)[];

const parseBinaryTreeArgument = (rawInput: string) => {
  let input: BinaryTreeInput | null = null;
  try {
    input = JSON.parse(rawInput);
  } catch (e) {
    console.warn(e);
  }

  if (!input || input.length === 0) return;

  const newDataNodes: Record<string, BinaryTreeNodeData> = {};

  const createNodeData = (value: number | undefined | null, depth: number) => {
    if (!isNumber(value)) return;

    const newId = uuid4.generate();
    newDataNodes[newId] = {
      id: newId,
      value: value,
      depth,
      x: 0,
      y: 0,
    };

    return newDataNodes[newId];
  };

  const rootNum = input[0];
  if (!isNumber(rootNum)) return;

  const rootData = createNodeData(rootNum, 0);
  if (!rootData) return;

  const queue: BinaryTreeNodeData[] = [rootData];

  let maxDepth = 0;

  let i = 1;

  while (queue.length > 0 && i < input.length) {
    const current = queue.shift();
    if (!current) break;

    const newDepth = current.depth + 1;

    maxDepth = newDepth;

    const newLeft = createNodeData(input[i], newDepth);
    if (newLeft) {
      current.left = newLeft.id;
      queue.push(newLeft);
    }
    i++;

    const newRight = createNodeData(input[i], newDepth);
    if (newRight) {
      current.right = newRight.id;
      queue.push(newRight);
    }
    i++;
  }

  return { maxDepth, newDataNodes };
};

export const useTreeParsing = () => {
  const dispatch = useAppDispatch();

  const args = useAppSelector(selectCaseArguments);
  const argsInfo = useAppSelector(selectCaseArgumentsInfo);
  const treeData = useAppSelector(treeDataSelector);

  useEffect(() => {
    const removedTrees = new Set<string>(Object.keys(treeData));
    for (const arg of args) {
      if (arg.type !== "binaryTree") continue;
      removedTrees.delete(arg.name);
      if (argsInfo[arg.name]?.isParsed) continue;

      dispatch(
        treeNodeSlice.actions.clear({
          name: arg.name,
        })
      );

      const parsed = parseBinaryTreeArgument(arg.input);
      if (!parsed) continue;

      dispatch(treeNodeSlice.actions.init({ name: arg.name }));
      dispatch(
        treeNodeSlice.actions.addMany({
          name: arg.name,
          data: {
            maxDepth: parsed.maxDepth,
            nodes: Object.values(parsed.newDataNodes),
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
