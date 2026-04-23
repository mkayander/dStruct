import {
  createEntityAdapter,
  createSelector,
  createSlice,
  current,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentTreeType } from "#/entities/argument/model/types";
import { type NodeDragState } from "#/features/treeViewer/model/editorSlice";
import {
  type BaseStructureItem,
  type BaseStructureState,
  getBaseStructureReducers,
  getInitialDataBase,
  getStateByName,
  type NamedPayload,
  runStateActionByName,
  type StructureNode,
} from "#/shared/model/baseStructureSlice";
import type { RootState } from "#/store/makeStore";

export type AnimationName = "blink";

export type TreeNodeData = StructureNode & {
  argType: ArgumentTreeType;
  depth: number;
  childrenIds: (string | undefined)[];
  x: number;
  y: number;
};

export type EdgeData = {
  id: string;
  sourceId: string;
  targetId: string;
  isDirected?: boolean;
  label?: string;
};

export const getEdgeId = (sourceId: string, targetId: string) => {
  if (sourceId > targetId) {
    [sourceId, targetId] = [targetId, sourceId];
  }

  return `${sourceId}-${targetId}`;
};

export type TreeData = BaseStructureItem<TreeNodeData> & {
  type: ArgumentTreeType;
  order: number;
  maxDepth: number;
  rootId: string | null;
  edges: EntityState<EdgeData, string>;
  initialEdges: EntityState<EdgeData, string> | null;
};

export type TreeDataState = BaseStructureState<TreeData>;

const treeNodeDataAdapter = createEntityAdapter<TreeNodeData>();
const edgeDataAdapter = createEntityAdapter<EdgeData>();

const getInitialData = (type: ArgumentTreeType, order: number): TreeData => ({
  ...getInitialDataBase(treeNodeDataAdapter),
  type,
  order,
  maxDepth: 0,
  rootId: null,
  edges: edgeDataAdapter.getInitialState(),
  initialEdges: null,
});
const initialState: TreeDataState = {};

const cloneEdges = (
  edges: EntityState<EdgeData, string>,
): EntityState<EdgeData, string> => ({
  ids: [...edges.ids],
  entities: Object.fromEntries(
    Object.entries(edges.entities).map(([id, edge]) => [
      id,
      edge ? { ...edge } : edge,
    ]),
  ),
});

const restoreInitialEdges = (treeState: TreeData) => {
  edgeDataAdapter.removeAll(treeState.edges);
  if (treeState.initialEdges === null) return;

  edgeDataAdapter.addMany(
    treeState.edges,
    Object.values(treeState.initialEdges.entities).filter(
      (edge): edge is EdgeData => edge !== undefined,
    ),
  );
};

/** All node ids in the subtree rooted at `rootId` (BFS over `childrenIds`). */
const collectSubtreeNodeIds = (
  entities: TreeData["nodes"]["entities"],
  rootId: string,
): string[] => {
  const orderedIds: string[] = [];
  const visited = new Set<string>();
  const queue: string[] = [rootId];
  let headIndex = 0;

  while (headIndex < queue.length) {
    const nodeId = queue[headIndex];
    headIndex += 1;
    if (!nodeId || visited.has(nodeId)) continue;
    visited.add(nodeId);
    orderedIds.push(nodeId);

    const node = entities[nodeId];
    if (!node) continue;
    for (const childId of node.childrenIds) {
      if (childId) {
        queue.push(childId);
      }
    }
  }

  return orderedIds;
};

/** Move every node and internal edge in the subtree rooted at `subtreeRootId` from one tree bucket to another (playback undo uses the same path as forward cross-tree `setChildId`). */
const moveSubtreeBetweenTreeBuckets = (
  state: TreeDataState,
  fromTreeName: string,
  toTreeName: string,
  subtreeRootId: string,
) => {
  if (fromTreeName === toTreeName) return;

  const fromTreeState = getStateByName(state, fromTreeName);
  if (!fromTreeState?.nodes.entities[subtreeRootId]) return;

  const subtreeIds = collectSubtreeNodeIds(
    fromTreeState.nodes.entities,
    subtreeRootId,
  );
  const subtreeIdSet = new Set(subtreeIds);

  const movedNodes: TreeNodeData[] = [];
  for (const nodeId of subtreeIds) {
    const node = fromTreeState.nodes.entities[nodeId];
    if (node) {
      const plain = current(node);
      movedNodes.push({
        ...plain,
        childrenIds: [...plain.childrenIds],
        info: plain.info ? { ...plain.info } : undefined,
      });
    }
  }

  const movedInternalEdges: EdgeData[] = [];
  const edgeIdsTouchingSubtree: string[] = [];
  for (const edge of Object.values(fromTreeState.edges.entities)) {
    if (!edge) continue;
    const sourceInSubtree = subtreeIdSet.has(edge.sourceId);
    const targetInSubtree = subtreeIdSet.has(edge.targetId);
    if (sourceInSubtree && targetInSubtree) {
      movedInternalEdges.push({ ...current(edge) });
    }
    if (sourceInSubtree || targetInSubtree) {
      edgeIdsTouchingSubtree.push(edge.id);
    }
  }

  if (movedNodes.length === 0) return;

  if (!getStateByName(state, toTreeName)) {
    const sampleArgType = movedNodes[0]?.argType;
    if (sampleArgType) {
      state[toTreeName] = {
        ...getInitialData(sampleArgType, 999),
        isRuntime: true,
      };
    }
  }

  // Insert into destination before removing from source so Immer never sees dangling draft-only data.
  runStateActionByName(state, toTreeName, (toTreeState) => {
    const hadNoNodesBeforeMove = toTreeState.nodes.ids.length === 0;

    // Manual insert: entity adapter `addMany` skipped inserts when moving snapshots from another
    // tree under the same Immer produce (duplicate id bookkeeping). Direct assignment is reliable.
    for (const node of movedNodes) {
      if (!(node.id in toTreeState.nodes.entities)) {
        toTreeState.nodes.ids.push(node.id);
      }
      toTreeState.nodes.entities[node.id] = node;
    }
    for (const edge of movedInternalEdges) {
      if (!(edge.id in toTreeState.edges.entities)) {
        toTreeState.edges.ids.push(edge.id);
      }
      toTreeState.edges.entities[edge.id] = edge;
    }

    if (
      hadNoNodesBeforeMove &&
      toTreeState.type === ArgumentType.BINARY_TREE &&
      toTreeState.rootId === null
    ) {
      toTreeState.rootId = subtreeRootId;
    }
  });

  runStateActionByName(state, fromTreeName, (mutableFrom) => {
    for (const edgeId of edgeIdsTouchingSubtree) {
      edgeDataAdapter.removeOne(mutableFrom.edges, edgeId);
    }
    treeNodeDataAdapter.removeMany(mutableFrom.nodes, subtreeIds);

    if (mutableFrom.nodes.ids.length === 0) {
      delete state[fromTreeName];
    } else if (mutableFrom.rootId && subtreeIdSet.has(mutableFrom.rootId)) {
      mutableFrom.rootId = null;
    }
  });
};

const applyChildIdUpdates = (
  treeState: TreeData,
  id: string,
  updates: Array<{ index: number; childId?: string }>,
) => {
  const node = treeNodeDataSelector.selectById(treeState.nodes, id);
  if (!node) return;

  const previousChildrenIds = [...node.childrenIds];
  const nextChildrenIds = [...previousChildrenIds];

  for (const { index, childId } of updates) {
    nextChildrenIds[index] = childId;
  }

  const removedChildIds = previousChildrenIds.filter(
    (childId): childId is string =>
      Boolean(childId) && !nextChildrenIds.includes(childId),
  );
  const addedChildIds = nextChildrenIds.filter(
    (childId): childId is string =>
      Boolean(childId) && !previousChildrenIds.includes(childId),
  );

  for (const childId of removedChildIds) {
    edgeDataAdapter.removeOne(treeState.edges, getEdgeId(id, childId));
  }

  for (const childId of addedChildIds) {
    edgeDataAdapter.addOne(treeState.edges, {
      id: getEdgeId(id, childId),
      sourceId: id,
      targetId: childId,
      isDirected: false,
    });
  }

  treeNodeDataAdapter.updateOne(treeState.nodes, {
    id,
    changes: { childrenIds: nextChildrenIds },
  });
};

const baseTreeReducers =
  getBaseStructureReducers<TreeNodeData>(treeNodeDataAdapter);

const deleteTreeNode = (
  state: TreeDataState,
  treeName: string,
  treeState: TreeData,
  id: string,
  cleanupState = true,
) => {
  if (!(id in treeState.nodes.entities)) return;

  const count = treeState.nodes.ids.length;
  if (count === 1 && cleanupState) {
    delete state[treeName];
  } else {
    if (treeState.rootId === id) {
      treeState.rootId = null;
    }
    treeNodeDataAdapter.removeOne(treeState.nodes, id);
  }
};

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const treeNodeSlice = createSlice({
  name: "TREE_STRUCTURE",
  initialState,
  reducers: {
    ...baseTreeReducers,
    init: (
      state,
      action: PayloadAction<{
        name: string;
        type: ArgumentTreeType;
        order: number;
      }>,
    ) => {
      const { name, type, order } = action.payload;
      state[name] = getInitialData(type, order);
    },
    add: (state, action: NamedPayload<TreeNodeData>) => {
      const {
        name,
        data: { argType },
      } = action.payload;
      let treeState = getStateByName(state, name);
      if (!treeState) {
        treeState = { ...getInitialData(argType, 999), isRuntime: true };
      }

      const nodeId = action.payload.data.id;
      treeState.nodes.ids.push(nodeId);
      treeState.nodes.entities[nodeId] = action.payload.data;

      // Runtime binary trees share one Redux tree per logical structure; first added node is the root for layout.
      if (argType === ArgumentType.BINARY_TREE && treeState.rootId === null) {
        treeState.rootId = nodeId;
      }

      state[name] = treeState;
    },
    addMany: (
      state,
      action: NamedPayload<{
        maxDepth: number;
        nodes: TreeNodeData[];
      }>,
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: {
            data: { maxDepth, nodes },
          },
        } = action;

        treeState.rootId = nodes[0]?.id || null;
        treeState.maxDepth = maxDepth;
        treeNodeDataAdapter.addMany(treeState.nodes, nodes);
      }),
    addManyEdges: (state, action: NamedPayload<EdgeData[]>) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: { data: edges },
        } = action;

        edgeDataAdapter.addMany(treeState.edges, edges);
      }),
    setChildId: (
      state,
      action: NamedPayload<{
        id: string;
        index: number;
        childId?: string;
        childTreeName?: string;
      }>,
    ) => {
      const { childId, childTreeName } = action.payload.data;

      // If child is from another tree, move the whole subtree (not only the root node) so
      // descendants stay linked when a parent node is re-parented under a new BinaryTree name.
      if (childId && childTreeName && childTreeName !== action.payload.name) {
        moveSubtreeBetweenTreeBuckets(
          state,
          childTreeName,
          action.payload.name,
          childId,
        );
      }

      // Normal child id update
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: {
            data: { id, index, childId },
          },
        } = action;
        applyChildIdUpdates(treeState, id, [{ index, childId }]);
      });
    },
    setChildIds: (
      state,
      action: NamedPayload<{
        id: string;
        updates: Array<{ index: number; childId?: string }>;
      }>,
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: {
            data: { id, updates },
          },
        } = action;

        applyChildIdUpdates(treeState, id, updates);
      }),
    revertChildId: (
      state,
      action: NamedPayload<{
        id: string;
        childId?: string | null;
        childTreeName?: string;
      }>,
    ) => {
      const { childId, childTreeName } = action.payload.data;
      if (!childId || !childTreeName || action.payload.name === childTreeName)
        return;

      const parentTreeName = action.payload.name;
      const parentTree = getStateByName(state, parentTreeName);
      const childNode = parentTree?.nodes.entities[childId];
      if (!childNode) return;

      moveSubtreeBetweenTreeBuckets(
        state,
        parentTreeName,
        childTreeName,
        childId,
      );
    },
    dragNode: (
      state,
      action: PayloadAction<
        NodeDragState & { clientX: number; clientY: number }
      >,
    ) =>
      runStateActionByName(state, action.payload.treeName, (treeState) => {
        const {
          payload: {
            nodeId,
            startX,
            startY,
            startClientX,
            startClientY,
            clientX,
            clientY,
          },
        } = action;

        const deltaX = clientX - startClientX;
        const deltaY = clientY - startClientY;

        treeNodeDataAdapter.updateOne(treeState.nodes, {
          id: nodeId,
          changes: { x: startX + deltaX, y: startY + deltaY },
        });
      }),
    setRoot: (state, action: NamedPayload<string>) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        treeState.rootId = action.payload.data;
      }),
    remove: (state, action: NamedPayload<Pick<TreeNodeData, "id">>) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          name,
          data: { id },
        } = action.payload;

        deleteTreeNode(state, name, treeState, id);
      }),
    backupAllNodes: (state) => {
      baseTreeReducers.backupAllNodes(state);

      for (const name in state) {
        runStateActionByName(state, name, (treeState) => {
          if (treeState.isRuntime || treeState.initialEdges !== null) return;

          treeState.initialEdges = cloneEdges(treeState.edges);
        });
      }
    },
    reset: (state, action: NamedPayload<void>) => {
      baseTreeReducers.reset(state, action);
      runStateActionByName(state, action.payload.name, (treeState) => {
        restoreInitialEdges(treeState);
      });
    },
    resetAll: (state) => {
      baseTreeReducers.resetAll(state);

      for (const name in state) {
        runStateActionByName(state, name, (treeState) => {
          restoreInitialEdges(treeState);
        });
      }
    },
  },
});

/**
 * Selector
 */
export const treeDataSelector = (state: RootState) => state.treeNode;

export type TreeDataSelect = {
  name: string;
  treeState: TreeData;
};
export type TreeDataStructures = {
  [ArgumentType.BINARY_TREE]: TreeDataSelect[];
  [ArgumentType.LINKED_LIST]: TreeDataSelect[];
  [ArgumentType.GRAPH]: TreeDataSelect[];
};
export const treeDataStructuresSelector = createSelector(
  treeDataSelector,
  (state) => {
    const structures: TreeDataStructures = {
      [ArgumentType.BINARY_TREE]: [],
      [ArgumentType.LINKED_LIST]: [],
      [ArgumentType.GRAPH]: [],
    };

    Object.entries(state)
      .sort(
        ([, { order: orderLeft }], [, { order: orderRight }]) =>
          orderLeft - orderRight,
      )
      .forEach(([name, treeState]) => {
        const type = treeState.type;
        structures[type].push({ name, treeState });
      });

    return structures;
  },
);

export const hasGraphArgumentsSelector = createSelector(
  treeDataStructuresSelector,
  (structures) => structures.graph.length > 0,
);

export const treeNodeDataSelector = treeNodeDataAdapter.getSelectors();

export const selectTreeData = (name: string) =>
  createSelector(treeDataSelector, (state) => getStateByName(state, name));

export const selectAllNodeData = (name: string) =>
  createSelector(treeDataSelector, (state) => {
    const treeState = state[name];
    if (!treeState) {
      console.error("selectAllNodeData: Tree state not found: ", name);
      return [];
    }

    return treeNodeDataSelector.selectAll(treeState.nodes);
  });

export const selectNodeDataById = (name: string, id: string) =>
  createSelector(treeDataSelector, (state) => {
    const treeState = getStateByName(state, name);
    if (!treeState) return null;

    return treeNodeDataSelector.selectById(treeState.nodes, id);
  });

export const selectNodeDataByIds = (
  name: string,
  ids: (string | undefined)[],
) =>
  createSelector(treeDataSelector, (state) => {
    if (!ids) return [];

    const treeState = getStateByName(state, name);
    if (!treeState) return null;

    const children = [];

    for (const id of ids) {
      if (!id) continue;

      const node = treeNodeDataSelector.selectById(treeState.nodes, id);
      if (node) children.push(node);
    }

    return children;
  });

export const selectRootNodeData = (name: string) =>
  createSelector(treeDataSelector, (state) => {
    const treeState = getStateByName(state, name);
    if (!treeState) return null;

    treeNodeDataSelector.selectById(treeState.nodes, treeState.rootId || "");
  });

export const selectNamedTreeMaxDepth = (name: string) =>
  createSelector(treeDataSelector, (state) => {
    const treeState = getStateByName(state, name);
    if (!treeState) return null;

    return treeState.maxDepth;
  });

export const selectTreeMaxDepth = createSelector(treeDataSelector, (state) =>
  Math.max(...Object.values(state).map((treeState) => treeState.maxDepth)),
);

/**
 * TODO: Implement a more efficient way to get the min x offset
 */
export const selectMinXOffset = (name: string, isEnabled = true) =>
  isEnabled
    ? createSelector(treeDataSelector, (state) => {
        const treeState = getStateByName(state, name);
        if (!treeState) return null;

        const nodes = treeNodeDataSelector.selectAll(treeState.nodes);
        if (!nodes.length) return 0;
        return Math.min(...nodes.map((node) => node.x));
      })
    : () => 0;
