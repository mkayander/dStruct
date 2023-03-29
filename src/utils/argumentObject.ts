import { z } from "zod";

export enum ArgumentType {
  "BINARY_TREE" = "binaryTree",
  "GRAPH" = "graph",
  "LINKED_LIST" = "linkedList",
  "ARRAY" = "array",
  "MATRIX" = "matrix",
  "STRING" = "string",
  "NUMBER" = "number",
  "BOOLEAN" = "boolean",
}

export type ArgumentTreeType =
  | ArgumentType.BINARY_TREE
  | ArgumentType.GRAPH
  | ArgumentType.LINKED_LIST;

export const argumentTreeTypeValues = new Set([
  ArgumentType.BINARY_TREE,
  ArgumentType.GRAPH,
  ArgumentType.LINKED_LIST,
]);

export const isArgumentTreeType = (
  type: ArgumentType
): type is ArgumentTreeType => argumentTreeTypeValues.has(type);

export type ArgumentObject = {
  name: string;
  type: ArgumentType;
  order: number;
  input: string;
};

export const argumentObjectValidator = z.object({
  name: z.string(),
  type: z.nativeEnum(ArgumentType),
  order: z.number(),
  input: z.string(),
});

export const isArgumentObjectValid = (
  args: unknown
): args is ArgumentObjectMap => {
  if (typeof args !== "object" || args === null) {
    return false;
  }

  for (const arg of Object.values(args)) {
    if (typeof arg !== "object" || arg === null) {
      return false;
    }
    if (!argumentObjectValidator.safeParse(arg).success) {
      return false;
    }
  }

  return true;
};

export type ArgumentObjectMap = Record<string, ArgumentObject>;

export const argumentTypeLabels: Record<ArgumentType, string> = {
  [ArgumentType.BINARY_TREE]: "Binary Tree",
  [ArgumentType.GRAPH]: "Graph",
  [ArgumentType.LINKED_LIST]: "Linked List",
  [ArgumentType.ARRAY]: "Array",
  [ArgumentType.MATRIX]: "Matrix",
  [ArgumentType.STRING]: "String",
  [ArgumentType.NUMBER]: "Number",
  [ArgumentType.BOOLEAN]: "Boolean",
};
