import { configureStore } from "@reduxjs/toolkit";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type {
  ArgumentObject,
  ArgumentTreeType,
} from "#/entities/argument/model/types";
import type {
  TreeData,
  TreeDataState,
  TreeNodeData,
} from "#/entities/dataStructures/node/model/nodeSlice";
import type {
  CallFrame,
  CallstackState,
  StructureTypeName,
} from "#/features/callstack/model/callstackSlice";
import invertTreeStateSnapshot from "#/features/homePage/model/assets/invert-tree-state.json";
import type { RootState } from "#/store/makeStore";
import { rootReducer } from "#/store/rootReducer";

type SnapshotState = typeof invertTreeStateSnapshot;
type SnapshotTree = SnapshotState["treeNode"][keyof SnapshotState["treeNode"]];
type SnapshotTreeNode =
  SnapshotTree["nodes"]["entities"][keyof SnapshotTree["nodes"]["entities"]];
type SnapshotCallFrame =
  SnapshotState["callstack"]["frames"]["entities"][keyof SnapshotState["callstack"]["frames"]["entities"]];

const normalizeSnapshotSetColorPrevArgs = (
  prevArgs: unknown,
): NonNullable<Extract<CallFrame, { name: "setColor" }>["prevArgs"]> => {
  if (!prevArgs || typeof prevArgs !== "object") {
    return {
      color: null,
      animation: null,
    };
  }

  const maybeColorPrevArgs = prevArgs as Record<string, unknown>;
  if (
    !("color" in maybeColorPrevArgs) &&
    !("animation" in maybeColorPrevArgs)
  ) {
    return {
      color: null,
      animation: null,
    };
  }

  return {
    color:
      typeof maybeColorPrevArgs.color === "string" ||
      maybeColorPrevArgs.color === null
        ? maybeColorPrevArgs.color
        : null,
    animation:
      typeof maybeColorPrevArgs.animation === "string" ||
      maybeColorPrevArgs.animation === null
        ? maybeColorPrevArgs.animation
        : null,
  };
};

const toArgumentTreeType = (value: string): ArgumentTreeType => {
  switch (value) {
    case ArgumentType.BINARY_TREE:
    case ArgumentType.GRAPH:
    case ArgumentType.LINKED_LIST:
      return value;
    default:
      throw new Error(
        `Unsupported tree argument type in landing preview: ${value}`,
      );
  }
};

const toStructureTypeName = (value: string): StructureTypeName => {
  switch (value) {
    case "treeNode":
    case "array":
      return value;
    default:
      throw new Error(
        `Unsupported structure type in landing preview: ${value}`,
      );
  }
};

const normalizeTreeNode = (node: SnapshotTreeNode): TreeNodeData => ({
  ...node,
  argType: toArgumentTreeType(node.argType),
  childrenIds: [...node.childrenIds],
});

const normalizeTreeEdges = (
  edges: SnapshotTree["edges"],
): TreeData["edges"] => ({
  ids: [...edges.ids],
  entities: Object.fromEntries(
    Object.entries(edges.entities).map(([id, edge]) => [id, edge]),
  ),
});

const normalizeTreeEntityState = (
  entityState:
    | SnapshotTree["nodes"]
    | SnapshotTree["hiddenNodes"]
    | NonNullable<SnapshotTree["initialNodes"]>,
) => ({
  ids: [...entityState.ids],
  entities: Object.fromEntries(
    Object.entries(entityState.entities).map(([id, node]) => [
      id,
      normalizeTreeNode(node),
    ]),
  ),
});

const normalizeTreeState = (treeState: SnapshotTree): TreeData => ({
  ...treeState,
  type: toArgumentTreeType(treeState.type),
  nodes: normalizeTreeEntityState(treeState.nodes),
  hiddenNodes: normalizeTreeEntityState(treeState.hiddenNodes),
  initialNodes: treeState.initialNodes
    ? normalizeTreeEntityState(treeState.initialNodes)
    : null,
  edges: normalizeTreeEdges(treeState.edges),
  initialEdges: normalizeTreeEdges(treeState.edges),
});

const normalizeCallFrame = (frame: SnapshotCallFrame): CallFrame => {
  switch (frame.name) {
    case "setColor":
      // The captured landing snapshot uses an empty object for initial
      // color frames, which semantically means "no previous highlight".
      // Normalize that into explicit nulls so grouped rewind clears color.
      return {
        id: frame.id,
        timestamp: frame.timestamp,
        name: "setColor",
        treeName: frame.treeName,
        nodeId: frame.nodeId,
        argType: toArgumentTreeType(frame.argType),
        structureType: toStructureTypeName(frame.structureType),
        args: {
          color: "color" in frame.args ? (frame.args.color ?? null) : null,
          animation:
            "animation" in frame.args ? (frame.args.animation ?? null) : null,
        },
        prevArgs: normalizeSnapshotSetColorPrevArgs(frame.prevArgs),
      };
    case "setLeftChild":
      return {
        id: frame.id,
        timestamp: frame.timestamp,
        name: "setLeftChild",
        treeName: frame.treeName,
        nodeId: frame.nodeId,
        argType: toArgumentTreeType(frame.argType),
        structureType: toStructureTypeName(frame.structureType),
        args: {
          childId: "childId" in frame.args ? frame.args.childId : null,
          childTreeName:
            "childTreeName" in frame.args
              ? frame.args.childTreeName
              : undefined,
        },
        prevArgs:
          frame.prevArgs && "childId" in frame.prevArgs
            ? {
                childId: frame.prevArgs.childId,
                childTreeName:
                  "childTreeName" in frame.prevArgs
                    ? frame.prevArgs.childTreeName
                    : undefined,
              }
            : undefined,
      };
    case "setRightChild":
      return {
        id: frame.id,
        timestamp: frame.timestamp,
        name: "setRightChild",
        treeName: frame.treeName,
        nodeId: frame.nodeId,
        argType: toArgumentTreeType(frame.argType),
        structureType: toStructureTypeName(frame.structureType),
        args: {
          childId: "childId" in frame.args ? frame.args.childId : null,
          childTreeName:
            "childTreeName" in frame.args
              ? frame.args.childTreeName
              : undefined,
        },
        prevArgs:
          frame.prevArgs && "childId" in frame.prevArgs
            ? {
                childId: frame.prevArgs.childId,
                childTreeName:
                  "childTreeName" in frame.prevArgs
                    ? frame.prevArgs.childTreeName
                    : undefined,
              }
            : undefined,
      };
    default:
      throw new Error(`Unsupported frame in landing preview: ${frame.name}`);
  }
};

const normalizeTreePreviewState = (): Pick<
  RootState,
  "treeNode" | "arrayStructure" | "callstack" | "testCase"
> => {
  const treeNodeState: TreeDataState = {};
  for (const [name, treeState] of Object.entries(
    invertTreeStateSnapshot.treeNode,
  )) {
    treeNodeState[name] = normalizeTreeState(treeState);
  }

  return {
    treeNode: treeNodeState,
    arrayStructure: invertTreeStateSnapshot.arrayStructure,
    callstack: {
      ...invertTreeStateSnapshot.callstack,
      isPlaying: false,
      frameIndex: -1,
      resetVersion: 0,
      lastRunCodeSource: null,
      codeModifiedSinceRun: true,
      error: null,
      frames: {
        ids: [...invertTreeStateSnapshot.callstack.frames.ids],
        entities: Object.fromEntries(
          Object.entries(invertTreeStateSnapshot.callstack.frames.entities).map(
            ([id, frame]) => [id, normalizeCallFrame(frame)],
          ),
        ),
      },
    } satisfies CallstackState,
    testCase: {
      ...invertTreeStateSnapshot.testCase,
      args: {
        ids: [...invertTreeStateSnapshot.testCase.args.ids],
        entities: Object.fromEntries(
          Object.entries(invertTreeStateSnapshot.testCase.args.entities).map(
            ([name, arg]) => [
              name,
              {
                ...arg,
                type: toArgumentTreeType(arg.type),
              } satisfies ArgumentObject<ArgumentTreeType>,
            ],
          ),
        ),
      },
      isEdited: false,
    },
  };
};

const assertLandingPreviewState = (
  previewState: Pick<
    RootState,
    "treeNode" | "arrayStructure" | "callstack" | "testCase"
  >,
) => {
  if (Object.keys(previewState.treeNode).length === 0) {
    throw new Error("Landing preview snapshot is missing tree data.");
  }

  if (previewState.callstack.frames.ids.length === 0) {
    throw new Error("Landing preview snapshot is missing callstack frames.");
  }

  if (previewState.testCase.args.ids.length === 0) {
    throw new Error("Landing preview snapshot is missing test case arguments.");
  }
};

const createLandingHeroPreviewPreloadedState = (): RootState => {
  const initialState = rootReducer(undefined, {
    type: "landingHeroPreview/init",
  });
  const previewState = normalizeTreePreviewState();
  assertLandingPreviewState(previewState);

  return {
    ...initialState,
    ...previewState,
  };
};

export const createLandingHeroPreviewStore = () =>
  configureStore({
    reducer: rootReducer,
    preloadedState: createLandingHeroPreviewPreloadedState(),
  });

export type LandingHeroPreviewStore = ReturnType<
  typeof createLandingHeroPreviewStore
>;
