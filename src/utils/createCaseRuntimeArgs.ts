import { ControlledArray } from "#/hooks/dataStructures/arrayStructure";
import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { ControlledString } from "#/hooks/dataStructures/stringStructure";
import { getMatrixChildArrayArgs } from "#/hooks/useArgumentsParsing";
import type { AppDispatch } from "#/store/makeStore";
import type {
  ArrayData,
  ArrayDataState,
} from "#/store/reducers/structures/arrayReducer";
import type {
  TreeData,
  TreeDataState,
} from "#/store/reducers/structures/treeNodeReducer";
import {
  type ArgumentObject,
  ArgumentType,
  isArgumentArrayType,
} from "#/utils/argumentObject";

const createRuntimeTree = (
  nodesData: TreeData | undefined,
  arg: ArgumentObject,
  dispatch: AppDispatch,
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
      return BinaryTreeNode.fromNodeData(arg.name, rootData, dataMap, dispatch);

    case ArgumentType.LINKED_LIST:
      return LinkedListNode.fromNodeData(arg.name, rootData, dataMap, dispatch);
  }
};

const createRuntimeArray = (
  nodesData: ArrayData | undefined,
  arg: ArgumentObject,
  dispatch: AppDispatch,
) => {
  if (!nodesData) return null;

  let arrayDataState = nodesData.nodes;
  if (nodesData.initialNodes !== null) {
    arrayDataState = nodesData.initialNodes;
  }

  arrayDataState = structuredClone(arrayDataState);

  if (nodesData.argType === ArgumentType.STRING) {
    return new ControlledString(arg.input, arg.name, arrayDataState, dispatch);
  }

  const array = JSON.parse(arg.input) as Array<number | string>;
  return new ControlledArray(array, arg.name, arrayDataState, dispatch);
};

const createRuntimeMatrix = (
  arrayStore: ArrayDataState,
  arg: ArgumentObject,
  dispatch: AppDispatch,
) => {
  if (!isArgumentArrayType(arg)) return null;

  const input = JSON.parse(arg.input) as (number | string)[][];
  const matrix: ReturnType<typeof createRuntimeArray>[] = new Array(
    input.length,
  );

  getMatrixChildArrayArgs(arg, (childArg, index) => {
    matrix[index] = createRuntimeArray(
      arrayStore[childArg.name],
      childArg,
      dispatch,
    );
  });

  return matrix;
};

export const createCaseRuntimeArgs = (
  dispatch: AppDispatch,
  treeStore: TreeDataState,
  arrayStore: ArrayDataState,
  args: ArgumentObject[],
) => {
  return args.map((arg) => {
    switch (arg.type) {
      case ArgumentType.LINKED_LIST:
      case ArgumentType.BINARY_TREE:
        return createRuntimeTree(treeStore[arg.name], arg, dispatch);

      case ArgumentType.NUMBER:
        return Number(arg.input);

      case ArgumentType.BOOLEAN:
        return arg.input === "true";

      case ArgumentType.STRING:
      case ArgumentType.ARRAY:
        return createRuntimeArray(arrayStore[arg.name], arg, dispatch);

      case ArgumentType.MATRIX:
        return createRuntimeMatrix(arrayStore, arg, dispatch);
    }
  });
};
