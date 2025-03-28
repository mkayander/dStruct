import {
  createEntityAdapter,
  createSelector,
  createSlice,
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
});
const initialState: TreeDataState = {};

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
    ...getBaseStructureReducers<TreeNodeData>(treeNodeDataAdapter),
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

      // If child is from another tree, remove it from the old tree and add it to the new one
      if (childId && childTreeName && childTreeName !== action.payload.name) {
        let childData: TreeNodeData | undefined = undefined;
        runStateActionByName(state, childTreeName, (childTreeState) => {
          childData = childTreeState.nodes.entities[childId];
          if (!childData) return;

          deleteTreeNode(state, childTreeName, childTreeState, childId, false);
        });

        runStateActionByName(state, action.payload.name, (treeState) => {
          if (!childData) return;

          childData.childrenIds = []; // TODO: Allow to keep track of relations to different trees
          treeNodeDataAdapter.addOne(treeState.nodes, childData);
        });
      }

      // Normal child id update
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: {
            data: { id, index, childId },
          },
        } = action;

        const node = treeNodeDataSelector.selectById(treeState.nodes, id);
        if (!node) return;

        const childrenIds = [...node.childrenIds];

        if (childrenIds[index]) {
          edgeDataAdapter.removeOne(
            treeState.edges,
            getEdgeId(id, childrenIds[index]),
          );
        }

        childrenIds[index] = childId;
        if (childId) {
          edgeDataAdapter.addOne(treeState.edges, {
            id: getEdgeId(id, childId),
            sourceId: id,
            targetId: childId,
            isDirected: false,
          });
        }

        treeNodeDataAdapter.updateOne(treeState.nodes, {
          id,
          changes: { childrenIds },
        });
      });
    },
    revertChildId: (
      state,
      action: NamedPayload<{
        id: string;
        childId?: string | null;
        childTreeName?: string;
      }>,
    ) => {
      const { id, childId, childTreeName } = action.payload.data;
      if (!childId || !childTreeName || action.payload.name === childTreeName)
        return;

      runStateActionByName(state, action.payload.name, (treeState) => {
        const node = treeNodeDataSelector.selectById(treeState.nodes, id);
        const childData = treeState.nodes.entities[childId];
        if (!node || !childData) return;

        deleteTreeNode(state, action.payload.name, treeState, childData.id);

        runStateActionByName(state, childTreeName, (childTreeState) => {
          treeNodeDataAdapter.addOne(childTreeState.nodes, childData);
        });
      });
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
      .sort(([, { order: a }], [, { order: b }]) => a - b)
      .forEach(([name, treeState]) => {
        const type = treeState.type;
        structures[type].push({ name, treeState });
      });

    return structures;
  },
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
