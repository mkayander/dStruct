import type { AppDispatch } from "#/store/makeStore";
import type { ArrayDataState } from "#/store/reducers/structures/arrayReducer";
import type { TreeDataState } from "#/store/reducers/structures/treeNodeReducer";
import { createRuntimeArray, createRuntimeTree } from "#/utils";
import { type ArgumentObject, ArgumentType } from "#/utils/argumentObject";

export const createCaseRuntimeArgs = (
  dispatch: AppDispatch,
  treeStore: TreeDataState,
  arrayStore: ArrayDataState,
  args: ArgumentObject[]
) => {
  return args.map((arg) => {
    switch (arg.type) {
      case ArgumentType.LINKED_LIST:
      case ArgumentType.BINARY_TREE:
        return createRuntimeTree(treeStore[arg.name], arg, dispatch);

      case ArgumentType.NUMBER:
        return Number(arg.input);

      case ArgumentType.STRING:
        return arg.input;

      case ArgumentType.BOOLEAN:
        return arg.input === "true";

      case ArgumentType.ARRAY:
        return createRuntimeArray(arrayStore[arg.name], arg, dispatch);

      case ArgumentType.MATRIX:
        return JSON.parse(arg.input) as number[][];
    }
  });
};
