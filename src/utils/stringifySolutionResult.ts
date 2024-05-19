import { type LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { ArgumentType } from "#/utils/argumentObject";

export const stripQuotes = (val?: string) => {
  if (val?.[0] === '"' && val.at(-1) === '"') {
    return val.slice(1, -1);
  }

  return String(val);
};

export const safeStringify = (val: unknown): string => {
  if (Array.isArray(val)) {
    const items = [];
    for (const item of val) {
      items.push(safeStringify(item));
    }
    return `[${items.join(", ")}]`;
  }

  const jsonString = JSON.stringify(
    val,
    (_, value) => {
      if (typeof value === "bigint") {
        return `${value}n`;
      }
      if (typeof value === "number" && !Number.isFinite(value)) {
        if (value > 0) {
          return "Inf";
        } else {
          return "-Inf";
        }
      }
      if (value && typeof value === "object" && "meta" in value) {
        switch (value.meta?.type) {
          case ArgumentType.LINKED_LIST:
            let current = value as LinkedListNode<any> | null;
            const output = [];

            while (current) {
              output.push(current._val);
              current = current._next;
            }

            return `[${output.join(" -> ")}]`;

          case ArgumentType.BINARY_TREE:
            return value.toString();
        }
      }
      if (value instanceof Set) {
        return `Set (${value.size}) {${[...value].join(", ")}}`;
      }
      if (value instanceof Map) {
        return `Map (${value.size}) {${[...value]
          .map(([key, val]) => `${key} => ${safeStringify(val)}`)
          .join(", ")}}`;
      }

      return value;
    },
    2,
  );

  return stripQuotes(jsonString);
};

export const stringifySolutionResult = (
  result?:
    | string
    | number
    | bigint
    | Set<unknown>
    | Map<unknown, unknown>
    | LinkedListNode<any>
    | null,
) => {
  if (result === null) return "null";
  if (result === undefined) return "undefined";

  return safeStringify(result);
};
