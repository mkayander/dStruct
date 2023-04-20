import { type LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { ArgumentType } from "#/utils/argumentObject";

const safeStringify = (val: unknown) =>
  JSON.stringify(val, (_, v) => (typeof v === "bigint" ? `${v}n` : v), 2);

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

  return safeStringify(result);
};
