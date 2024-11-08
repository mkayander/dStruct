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

export const argumentTreeTypeValues = new Set([
  ArgumentType.BINARY_TREE,
  ArgumentType.GRAPH,
  ArgumentType.LINKED_LIST,
]);
