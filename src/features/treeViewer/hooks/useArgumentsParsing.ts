"use client";

import { useEffect } from "react";
import { generate } from "short-uuid";

import {
  isArgumentArrayType,
  isArgumentTreeType,
} from "#/entities/argument/lib";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import {
  type ArgumentInfo,
  caseSlice,
  selectCaseArguments,
  selectCaseArgumentsInfo,
} from "#/entities/argument/model/caseSlice";
import type {
  ArgumentArrayType,
  ArgumentObject,
  ArgumentTreeType,
} from "#/entities/argument/model/types";
import {
  arrayDataSelector,
  type ArrayItemData,
  arrayStructureSlice,
} from "#/entities/dataStructures/array/model/arraySlice";
import {
  findCentroid,
  positionSnowflakeNodes,
} from "#/entities/dataStructures/graph/lib";
import {
  type EdgeData,
  getEdgeId,
  treeDataSelector,
  type TreeNodeData,
  treeNodeSlice,
} from "#/entities/dataStructures/node/model/nodeSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import { isNumber } from "#/shared/lib";
import { safeStringify } from "#/shared/lib/stringifySolutionResult";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { type AppDispatch } from "#/store/makeStore";

export type TreeInput = (number | null)[];
export type GraphInput = Array<[number, number, number]>;

const createNodeData = (
  map: Record<string, TreeNodeData>,
  value: number | undefined | null,
  depth: number,
  argType: ArgumentTreeType,
) => {
  if (!isNumber(value)) return;

  const newId = generate();
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

type TreeParsingResult =
  | {
      maxDepth: number;
      nodesMap: Record<string, TreeNodeData>;
      edgesMap: Record<string, EdgeData>;
    }
  | undefined;

const parseBinaryTreeArgument = (rawInput: string): TreeParsingResult => {
  const type = ArgumentType.BINARY_TREE;
  let input: TreeInput | null = null;
  try {
    input = JSON.parse(rawInput);
  } catch (e) {
    console.warn(e);
  }

  if (!input || input.length === 0) return;

  const nodesMap: Record<string, TreeNodeData> = {};
  const edgesMap: Record<string, EdgeData> = {};

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

      const leftEdge = getEdgeId(current.id, newLeft.id);
      edgesMap[leftEdge] = {
        id: leftEdge,
        sourceId: current.id,
        targetId: newLeft.id,
        isDirected: false,
      };
      queue.push(newLeft);
    }
    i++;

    const newRight = createNodeData(nodesMap, input[i], newDepth, type);
    if (newRight) {
      current.childrenIds[1] = newRight.id;

      const rightEdge = getEdgeId(current.id, newRight.id);
      edgesMap[rightEdge] = {
        id: rightEdge,
        sourceId: current.id,
        targetId: newRight.id,
        isDirected: false,
      };
      queue.push(newRight);
    }
    i++;
  }

  return { maxDepth, nodesMap, edgesMap };
};

const parseLinkedListArgument = (rawInput: string): TreeParsingResult => {
  let input: TreeInput | null = null;
  try {
    input = JSON.parse(rawInput);
  } catch (e) {
    console.warn(e);
  }

  if (!input || input.length === 0) return;

  const nodesMap: Record<string, TreeNodeData> = {};
  const edgesMap: Record<string, EdgeData> = {};

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

      const edgeId = getEdgeId(prevNode.id, newNode.id);
      edgesMap[edgeId] = {
        id: edgeId,
        sourceId: prevNode.id,
        targetId: newNode.id,
        isDirected: true,
      };
    }

    prevNode = newNode;
    maxDepth++;
  }

  return { maxDepth, nodesMap, edgesMap };
};

const parseGraphArgument = (
  arg: ArgumentObject<ArgumentTreeType>,
): TreeParsingResult => {
  const rawInput = arg.input;
  let input: GraphInput | null = null;
  try {
    input = JSON.parse(rawInput);
  } catch (e) {
    console.warn(e);
  }

  if (!input || input.length === 0) return;

  const savedData = arg.nodeData ?? {};
  const nodesMap: Record<string, TreeNodeData> = {};
  const edgesMap: Record<string, EdgeData> = {};
  const idMap = new Map<number, TreeNodeData>();
  const adjacencyList = new Map<number, number[]>();

  const initNode = (value: number): TreeNodeData => {
    if (idMap.get(value)) return idMap.get(value)!;

    const newNode = createNodeData(nodesMap, value, 0, ArgumentType.GRAPH);
    if (!newNode) {
      throw new Error("Failed to create node data");
    }

    const { x, y } = savedData[value] ?? { x: 0, y: 0 };
    newNode.x = x;
    newNode.y = y;

    idMap.set(value, newNode);
    adjacencyList.set(value, []);
    return newNode;
  };

  const initEdge = (
    fromId: string,
    toId: string,
    label?: string | number,
  ): EdgeData => {
    const id = getEdgeId(fromId, toId);
    if (edgesMap[id]) return edgesMap[id];

    if (label !== undefined) {
      label = String(label);
    }
    const newEdge: EdgeData = {
      id,
      sourceId: fromId,
      targetId: toId,
      label,
      isDirected: true,
    };
    edgesMap[id] = newEdge;
    return newEdge;
  };

  for (const value of input) {
    if (!Array.isArray(value)) continue;
    const [from, to, weight] = value;
    if (!isNumber(from) || !isNumber(to)) continue;

    const fromNode = initNode(from);
    const toNode = initNode(to);
    initEdge(fromNode.id, toNode.id, weight);

    fromNode.childrenIds.push(toNode.id);
    adjacencyList.get(from)!.push(to);
    adjacencyList.get(to)!.push(from);
  }

  const centroid = findCentroid(adjacencyList);
  if (!centroid) return;

  const centroidData = idMap.get(centroid);
  if (centroidData) {
    if (!centroidData.x && !centroidData.y) {
      centroidData.x = 300;
      centroidData.y = 300;
    }

    positionSnowflakeNodes(
      adjacencyList,
      idMap,
      centroid,
      centroidData.x,
      centroidData.y,
    );
  }

  return { maxDepth: 0, nodesMap, edgesMap };
};

const parseTreeArgument = (
  arg: ArgumentObject<ArgumentTreeType>,
  argsInfo: Record<string, ArgumentInfo>,
  dispatch: AppDispatch,
): TreeParsingResult => {
  if (argsInfo[arg.name]?.isParsed) return;

  dispatch(
    treeNodeSlice.actions.clear({
      name: arg.name,
      data: undefined,
    }),
  );

  let parsed: TreeParsingResult;
  switch (arg.type) {
    case ArgumentType.BINARY_TREE:
      parsed = parseBinaryTreeArgument(arg.input);
      break;
    case ArgumentType.LINKED_LIST:
      parsed = parseLinkedListArgument(arg.input);
      break;
    case ArgumentType.GRAPH:
      parsed = parseGraphArgument(arg);
      break;
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
  if (parsed.edgesMap) {
    dispatch(
      treeNodeSlice.actions.addManyEdges({
        name: arg.name,
        data: Object.values(parsed.edgesMap),
      }),
    );
  }
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
      data: undefined,
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
      const newId = generate();
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
  if (newItems) {
    dispatch(
      arrayStructureSlice.actions.addMany({
        name: arg.name,
        data: newItems,
      }),
    );
  }

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

    if (removedTreeNames.size > 0) {
      dispatch(treeNodeSlice.actions.clearMany([...removedTreeNames]));
    }
    if (removedArrayNames.size > 0) {
      dispatch(arrayStructureSlice.actions.clearMany([...removedArrayNames]));
    }

    dispatch(callstackSlice.actions.removeAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args, argsInfo, dispatch]);
};
