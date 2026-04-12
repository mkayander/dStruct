import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";
import {
  serializeBinaryTreeLevelOrderWithIds,
  serializeLinkedListWithIds,
} from "#/entities/dataStructures/node/lib/serializeTreeForPython";
import type { TreeDataState } from "#/entities/dataStructures/node/model/nodeSlice";

export type SerializedPythonArg = { type: string; value: unknown };

export type CreatePythonRuntimeArgsOptions = {
  treeNode?: TreeDataState;
};

function serializeFallback(argument: ArgumentObject): SerializedPythonArg {
  return { type: argument.type, value: argument.input };
}

/**
 * Serialize case arguments for Python execution.
 * Returns [{type, value}, ...] for the Python harness to reconstruct (TreeNode, etc.).
 */
export function createPythonRuntimeArgs(
  args: ArgumentObject[],
  options?: CreatePythonRuntimeArgsOptions,
): SerializedPythonArg[] {
  const treeStore = options?.treeNode;

  return args.map((arg) => {
    switch (arg.type) {
      case ArgumentType.STRING:
        return { type: ArgumentType.STRING, value: arg.input ?? "" };

      case ArgumentType.NUMBER:
        return { type: ArgumentType.NUMBER, value: Number(arg.input) };

      case ArgumentType.BOOLEAN:
        return { type: ArgumentType.BOOLEAN, value: arg.input === "true" };

      case ArgumentType.ARRAY:
      case ArgumentType.MATRIX:
        return {
          type: arg.type,
          value: arg.input ? JSON.parse(arg.input) : [],
        };

      case ArgumentType.BINARY_TREE: {
        const tracked =
          treeStore &&
          serializeBinaryTreeLevelOrderWithIds(treeStore[arg.name], arg.name);
        if (tracked) {
          return { type: arg.type, value: tracked };
        }
        return {
          type: arg.type,
          value: arg.input ? JSON.parse(arg.input) : null,
        };
      }

      case ArgumentType.LINKED_LIST: {
        const tracked =
          treeStore &&
          serializeLinkedListWithIds(treeStore[arg.name], arg.name);
        if (tracked) {
          return { type: arg.type, value: tracked };
        }
        return {
          type: arg.type,
          value: arg.input ? JSON.parse(arg.input) : null,
        };
      }

      case ArgumentType.GRAPH:
        return {
          type: arg.type,
          value: arg.input ? JSON.parse(arg.input) : null,
        };

      case ArgumentType.SET:
      case ArgumentType.MAP:
      case ArgumentType.OBJECT:
        return {
          type: arg.type,
          value: arg.input ? JSON.parse(arg.input) : null,
        };

      default: {
        return serializeFallback(arg);
      }
    }
  });
}
