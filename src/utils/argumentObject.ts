import { z } from "zod";

export enum ArgumentType {
  "BINARY_TREE" = "binaryTree",
  "GRAPH" = "graph",
  "LINKED_LIST" = "linkedList",
  "ARRAY" = "array",
  "SET" = "set",
  "MAP" = "map",
  "OBJECT" = "object",
  "MATRIX" = "matrix",
  "STRING" = "string",
  "NUMBER" = "number",
  "BOOLEAN" = "boolean",
}

export type ArgumentTreeType =
  | ArgumentType.BINARY_TREE
  | ArgumentType.GRAPH
  | ArgumentType.LINKED_LIST;

export type ArgumentArrayType =
  | ArgumentType.ARRAY
  | ArgumentType.MATRIX
  | ArgumentType.STRING
  | ArgumentType.SET
  | ArgumentType.MAP
  | ArgumentType.OBJECT;

export const argumentTreeTypeValues = new Set([
  ArgumentType.BINARY_TREE,
  ArgumentType.GRAPH,
  ArgumentType.LINKED_LIST,
]);

export function isArgumentTreeType(
  type: ArgumentType,
): type is ArgumentTreeType;
export function isArgumentTreeType(
  arg: ArgumentObject,
): arg is ArgumentObject<ArgumentTreeType>;
export function isArgumentTreeType(
  arg: ArgumentObject | ArgumentType,
): arg is ArgumentObject<ArgumentTreeType> {
  if (typeof arg === "object") {
    return isArgumentTreeType(arg.type);
  }

  return argumentTreeTypeValues.has(arg);
}

export function isArgumentArrayType(
  type: ArgumentType,
): type is ArgumentArrayType;
export function isArgumentArrayType(
  arg: ArgumentObject,
): arg is ArgumentObject<ArgumentArrayType>;
export function isArgumentArrayType(
  arg: ArgumentObject | ArgumentType,
): arg is ArgumentObject<ArgumentArrayType> {
  if (typeof arg === "object") {
    return isArgumentArrayType(arg.type);
  }

  return (
    arg === ArgumentType.ARRAY ||
    arg === ArgumentType.MATRIX ||
    arg === ArgumentType.STRING ||
    arg === ArgumentType.SET ||
    arg === ArgumentType.MAP ||
    arg === ArgumentType.OBJECT
  );
}

type BaseArgumentData = {
  name: string;
  parentName?: string;
  order: number;
  input: string;
};

export type TreeArgumentData = BaseArgumentData & {
  nodeData?: Record<
    string,
    {
      x: number;
      y: number;
    }
  >;
};

export type ArgumentObject<T extends ArgumentType = ArgumentType> =
  T extends ArgumentTreeType
    ? TreeArgumentData & { type: T }
    : BaseArgumentData & { type: T };

export const argumentObjectValidator = z.object({
  name: z.string(),
  type: z.nativeEnum(ArgumentType),
  order: z.number(),
  input: z.string(),
  nodeData: z.record(z.object({ x: z.number(), y: z.number() })).optional(),
});

export const isArgumentObjectValid = (
  args: unknown,
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
  [ArgumentType.SET]: "Set",
  [ArgumentType.MAP]: "Map",
  [ArgumentType.OBJECT]: "Object",
  [ArgumentType.NUMBER]: "Number",
  [ArgumentType.BOOLEAN]: "Boolean",
};
