import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";

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
