import { type LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { ArgumentType } from "#/utils/argumentObject";

const safeStringify = (val: unknown) =>
  JSON.stringify(
    val,
    (_, value) => {
      if (typeof value === "bigint") {
        return `${value}n`;
      }
      if (Array.isArray(value)) {
        return `[${value.join(", ")}]`;
      }

      return value;
    },
    2
  );

export const stringifySolutionResult = (
  result: string | number | bigint | LinkedListNode | null
) => {
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

  const output = safeStringify(result);
  if (output[0] === '"' && output.at(-1) === '"') {
    return output.slice(1, -1);
  }

  return output;
};
