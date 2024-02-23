"use client";

import { useEffect } from "react";
import uuid4 from "short-uuid";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { type AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import {
  type ArgumentInfo,
  caseSlice,
  selectCaseArguments,
  selectCaseArgumentsInfo,
} from "#/store/reducers/caseReducer";
import {
  arrayDataSelector,
  type ArrayItemData,
  arrayStructureSlice,
} from "#/store/reducers/structures/arrayReducer";
import {
  treeDataSelector,
  type TreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/structures/treeNodeReducer";
import { isNumber } from "#/utils";
import {
  type ArgumentArrayType,
  type ArgumentObject,
  type ArgumentTreeType,
  ArgumentType,
  isArgumentArrayType,
  isArgumentTreeType,
} from "#/utils/argumentObject";
import { safeStringify } from "#/utils/stringifySolutionResult";

export type TreeInput = (number | null)[];

const createNodeData = (
  map: Record<string, TreeNodeData>,
  value: number | undefined | null,
  depth: number,
  argType: ArgumentTreeType,
) => {
  if (!isNumber(value)) return;

  const newId = uuid4.generate();
  map[newId] = {
    id: newId,
    value: value,
    argType,
    depth,
    x: 0,
    y: 0,
    childrenIds: [],
  };

  return map[newId];
};

const parseBinaryTreeArgument = (rawInput: string) => {
  const type = ArgumentType.BINARY_TREE;
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

  const rootData = createNodeData(nodesMap, rootNum, 0, type);
  if (!rootData) return;

  const queue: TreeNodeData[] = [rootData];

  let maxDepth = 0;

  let i = 1;

  while (queue.length > 0 && i < input.length) {
    const current = queue.shift();
    if (!current) break;

    const newDepth = current.depth + 1;

    maxDepth = newDepth;

    const newLeft = createNodeData(nodesMap, input[i], newDepth, type);
    if (newLeft) {
      current.childrenIds[0] = newLeft.id;
      queue.push(newLeft);
    }
    i++;

    const newRight = createNodeData(nodesMap, input[i], newDepth, type);
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

    const newNode = createNodeData(
      nodesMap,
      value,
      0,
      ArgumentType.LINKED_LIST,
    );
    if (!newNode) continue;

    if (prevNode) {
      prevNode.childrenIds[0] = newNode.id;
    }

    prevNode = newNode;
    maxDepth++;
  }

  return { maxDepth, nodesMap };
};

const parseTreeArgument = (
  arg: ArgumentObject<ArgumentTreeType>,
  argsInfo: Record<string, ArgumentInfo>,
  dispatch: AppDispatch,
) => {
  if (argsInfo[arg.name]?.isParsed) return;

  dispatch(
    treeNodeSlice.actions.clear({
      name: arg.name,
    }),
  );

  let parsed = null;
  switch (arg.type) {
    case ArgumentType.BINARY_TREE:
      parsed = parseBinaryTreeArgument(arg.input);
      break;
    case ArgumentType.LINKED_LIST:
      parsed = parseLinkedListArgument(arg.input);
  }
  if (!parsed) return;

  dispatch(
    treeNodeSlice.actions.init({
      name: arg.name,
      type: arg.type,
      order: arg.order,
    }),
  );
  dispatch(
    treeNodeSlice.actions.addMany({
      name: arg.name,
      data: {
        maxDepth: parsed.maxDepth,
        nodes: Object.values(parsed.nodesMap),
      },
    }),
  );
  dispatch(
    caseSlice.actions.updateArgumentInfo({
      name: arg.name,
      data: { isParsed: true },
    }),
  );
};

export const getChildArrayName = (name: string, index: number) =>
  `${name}-[${index}]`;

type ArrayArg = ArgumentObject<ArgumentArrayType>;

export const getMatrixChildArrayArgs = (
  arg: ArrayArg,
  onParsed?: (arg: ArrayArg, index: number) => void,
): ArrayArg[] => {
  const input = JSON.parse(arg.input) as (Array<number | string> | string)[];
  const childArgs: ArrayArg[] = [];

  for (let i = 0; i < input.length; i++) {
    const name = getChildArrayName(arg.name, i);
    const item = input[i];
    const newArg: ArrayArg = {
      name,
      parentName: arg.name,
      type: Array.isArray(item) ? ArgumentType.ARRAY : ArgumentType.STRING,
      input: JSON.stringify(item),
      order: arg.order + i + 1,
    };
    childArgs.push(newArg);
    onParsed?.(newArg, i);
  }

  return childArgs;
};

const parseArrayArgument = (
  arg: ArrayArg,
  argsInfo: Record<string, ArgumentInfo>,
  dispatch: AppDispatch,
): ArrayArg[] | undefined => {
  if (argsInfo[arg.name]?.isParsed) return;

  dispatch(
    arrayStructureSlice.actions.clear({
      name: arg.name,
    }),
  );

  let array: Array<number | string> | null = null;

  let childArgs: ArrayArg[] | undefined;
  if (arg.type === ArgumentType.MATRIX) {
    try {
      childArgs = getMatrixChildArrayArgs(arg, (childArg) =>
        parseArrayArgument(childArg, argsInfo, dispatch),
      );
      array = new Array(childArgs.length);
    } catch (e) {
      console.warn(e);
    }
  }
  const childNames = childArgs?.map((arg) => arg.name);
  if (arg.type === ArgumentType.ARRAY) {
    try {
      array = JSON.parse(arg.input);
    } catch (e) {
      console.warn(e);
    }
  } else if (arg.type === ArgumentType.STRING) {
    array = arg.input.split("");
  }

  let newItems: ArrayItemData[] | null = null;
  if (array) {
    newItems = [];
    for (let i = 0; i < array.length; i++) {
      let value: string | undefined = safeStringify(array[i]);
      const childName = childNames?.[i];
      if (childName) {
        value = undefined;
      }
      const newId = uuid4.generate();
      newItems[i] = {
        id: newId,
        index: i,
        value,
        childName,
      };
    }
  }

  dispatch(
    arrayStructureSlice.actions.init({
      name: arg.name,
      parentName: arg.parentName,
      childNames: childArgs?.map((arg) => arg.name),
      order: arg.order,
      argType: arg.type,
    }),
  );
  newItems &&
    dispatch(
      arrayStructureSlice.actions.addMany({
        name: arg.name,
        data: newItems,
      }),
    );

  dispatch(
    caseSlice.actions.updateArgumentInfo({
      name: arg.name,
      data: { isParsed: true },
    }),
  );

  return childArgs;
};

export const useArgumentsParsing = () => {
  const dispatch = useAppDispatch();

  const args = useAppSelector(selectCaseArguments);
  const argsInfo = useAppSelector(selectCaseArgumentsInfo);
  const treeData = useAppSelector(treeDataSelector);
  const arrayData = useAppSelector(arrayDataSelector);

  useEffect(() => {
    const removedTreeNames = new Set(Object.keys(treeData));
    const removedArrayNames = new Set(Object.keys(arrayData));
    for (const arg of args) {
      if (isArgumentTreeType(arg)) {
        parseTreeArgument(arg, argsInfo, dispatch);
        removedTreeNames.delete(arg.name);
      } else if (isArgumentArrayType(arg)) {
        const childNames =
          parseArrayArgument(arg, argsInfo, dispatch) ??
          arrayData[arg.name]?.childNames;

        childNames?.forEach((value) => {
          const name = typeof value === "string" ? value : value.name;
          removedArrayNames.delete(name);
        });

        removedArrayNames.delete(arg.name);
      }
    }

    removedTreeNames.size > 0 &&
      dispatch(treeNodeSlice.actions.clearMany([...removedTreeNames]));
    removedArrayNames.size > 0 &&
      dispatch(arrayStructureSlice.actions.clearMany([...removedArrayNames]));

    dispatch(callstackSlice.actions.removeAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args, argsInfo, dispatch]);
};
