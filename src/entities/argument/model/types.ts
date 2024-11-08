import type { ArgumentType } from "./argumentObject";

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

export type ArgumentObjectMap = Record<string, ArgumentObject>;
