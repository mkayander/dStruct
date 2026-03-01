import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";

export type SerializedPythonArg = { type: string; value: unknown };

function serializeFallback(a: ArgumentObject): SerializedPythonArg {
  return { type: a.type, value: a.input };
}

/**
 * Serialize case arguments for Python execution.
 * Returns [{type, value}, ...] for the Python harness to reconstruct (TreeNode, etc.).
 */
export function createPythonRuntimeArgs(
  args: ArgumentObject[],
): SerializedPythonArg[] {
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

      case ArgumentType.LINKED_LIST:
      case ArgumentType.BINARY_TREE:
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
