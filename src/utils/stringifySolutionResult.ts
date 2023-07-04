import { type LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { ArgumentType } from "#/utils/argumentObject";

export const safeStringify = (val: unknown) =>
  JSON.stringify(
    val,
    (_, value) => {
      if (typeof value === "bigint") {
        return `${value}n`;
      }
      if (Array.isArray(value)) {
        return `[${value.join(", ")}]`;
      }
      if (value instanceof Set) {
        return `Set (${value.size}) {${[...value].join(", ")}}`;
      }
      if (value instanceof Map) {
        return `Map (${value.size}) {${[...value]
          .map(([key, val]) => `${key} => ${val}`)
          .join(", ")}}`;
      }

      return value;
    },
    2
  );

export const stripQuotes = (val: string) => {
  if (val[0] === '"' && val.at(-1) === '"') {
    return val.slice(1, -1);
  }

  return val;
};

export const stringifySolutionResult = (
  result?:
    | string
    | number
    | bigint
    | Set<unknown>
    | Map<unknown, unknown>
    | LinkedListNode
    | null
) => {
  if (result === null) return "null";
  if (result === undefined) return "undefined";

  if (typeof result === "bigint") {
    return `${result}n`;
  }

  if (
    result &&
    typeof result === "object" &&
    "meta" in result &&
    result.meta?.type === ArgumentType.LINKED_LIST
  ) {
    let current = result as LinkedListNode | null;
    const output = [];

    while (current) {
      output.push(current._val);
      current = current._next;
    }

    return output.join(" -> ");
  }

  return stripQuotes(safeStringify(result));
};
