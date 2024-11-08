import { isArgumentArrayType } from "#/entities/argument/lib";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";
import { ControlledArray } from "#/hooks/dataStructures/arrayStructure";
import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { ControlledGraphArray } from "#/hooks/dataStructures/graphArray";
import { LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { ControlledString } from "#/hooks/dataStructures/stringStructure";
import { getMatrixChildArrayArgs } from "#/hooks/useArgumentsParsing";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import type {
  ArrayData,
  ArrayDataState,
} from "#/store/reducers/structures/arrayReducer";
import type {
  TreeData,
  TreeDataState,
} from "#/store/reducers/structures/treeNodeReducer";

const createRuntimeTree = (
  nodesData: TreeData | undefined,
  arg: ArgumentObject,
  callstack: CallstackHelper,
) => {
  if (!nodesData) {
    console.error("No nodes data found for binary tree");
    return null;
  }
  const rootId = nodesData.rootId;
  if (!rootId) return null;

  let dataMap = nodesData.nodes.entities;
  if (nodesData.initialNodes !== null) {
    dataMap = nodesData.initialNodes.entities;
  }

  const rootData = dataMap[rootId];

  switch (nodesData.type) {
    case ArgumentType.BINARY_TREE:
      return BinaryTreeNode.fromNodeData(
        arg.name,
        rootData,
        dataMap,
        callstack,
      );

    case ArgumentType.LINKED_LIST:
      return LinkedListNode.fromNodeData(
        arg.name,
        rootData,
        dataMap,
        callstack,
      );
  }
};

const createRuntimeArray = (
  nodesData: ArrayData | undefined,
  arg: ArgumentObject,
  callstack: CallstackHelper,
) => {
  if (!nodesData) return null;

  let arrayDataState = nodesData.nodes;
  if (nodesData.initialNodes !== null) {
    arrayDataState = nodesData.initialNodes;
  }

  arrayDataState = structuredClone(arrayDataState);

  if (nodesData.argType === ArgumentType.STRING) {
    return new ControlledString(arg.input, arg.name, arrayDataState, callstack);
  }

  const array = JSON.parse(arg.input) as Array<number | string>;
  return new ControlledArray(array, arg.name, arrayDataState, callstack);
};

const createRuntimeMatrix = (
  arrayStore: ArrayDataState,
  arg: ArgumentObject,
  callstack: CallstackHelper,
) => {
  const nodeData = arrayStore[arg.name];
  if (!isArgumentArrayType(arg) || !nodeData) return null;

  const children = getMatrixChildArrayArgs(arg).map((child) =>
    createRuntimeArray(arrayStore[child.name], child, callstack),
  );

  const matrix = new ControlledArray(
    children,
    arg.name,
    nodeData.nodes,
    callstack,
  );

  return matrix;
};

const createRuntimeGraph = (
  nodesData: TreeData | undefined,
  arg: ArgumentObject,
  callstack: CallstackHelper,
) => {
  if (arg.type !== ArgumentType.GRAPH || !nodesData) return null;

  const input = JSON.parse(arg.input);

  return new ControlledGraphArray(input, arg.name, nodesData.nodes, callstack);
};

/**
 * Create controlled/tracked runtime arguments for a visual function call.
 * @param callstack - Callstack to be filled as the function is executed.
 * @param treeStore - Tree data store.
 * @param arrayStore - Array data store.
 * @param args - Arguments to be converted.
 * @returns Controlled runtime arguments.
 */
export const createCaseRuntimeArgs = (
  callstack: CallstackHelper,
  treeStore: TreeDataState,
  arrayStore: ArrayDataState,
  args: ArgumentObject[],
) => {
  return args.map((arg) => {
    switch (arg.type) {
      case ArgumentType.LINKED_LIST:
      case ArgumentType.BINARY_TREE:
        return createRuntimeTree(treeStore[arg.name], arg, callstack);

      case ArgumentType.NUMBER:
        return Number(arg.input);

      case ArgumentType.BOOLEAN:
        return arg.input === "true";

      case ArgumentType.STRING:
      case ArgumentType.ARRAY:
        return createRuntimeArray(arrayStore[arg.name], arg, callstack);

      case ArgumentType.MATRIX:
        return createRuntimeMatrix(arrayStore, arg, callstack);

      case ArgumentType.GRAPH:
        return createRuntimeGraph(treeStore[arg.name], arg, callstack);
    }
  });
};

/**
 * Create raw JavaScript function arguments that are not controlled/tracked.
 * Use for benchmarks and other non-visual operations.
 * @param args - Arguments to be converted.
 * @returns Raw JavaScript function arguments.
 */
export const createRawRuntimeArgs = (args: ArgumentObject[]) =>
  args.map((arg) => {
    switch (arg.type) {
      case ArgumentType.STRING:
        return arg.input;

      case ArgumentType.NUMBER:
        return Number(arg.input);

      case ArgumentType.BOOLEAN:
        return arg.input === "true";

      case ArgumentType.ARRAY:
      case ArgumentType.MATRIX:
      case ArgumentType.LINKED_LIST:
      case ArgumentType.BINARY_TREE:
      case ArgumentType.GRAPH:
        return JSON.parse(arg.input);
    }
  });
