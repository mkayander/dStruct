import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";
import { createRuntimeArray } from "#/entities/dataStructures/array/lib";
import type { ArrayDataState } from "#/entities/dataStructures/array/model/arraySlice";
import { createRuntimeGraph } from "#/entities/dataStructures/graph/lib";
import { createRuntimeMatrix } from "#/entities/dataStructures/matrix/lib";
import { createRuntimeTree } from "#/entities/dataStructures/node/lib";
import type { TreeDataState } from "#/entities/dataStructures/node/model/nodeSlice";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";

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
