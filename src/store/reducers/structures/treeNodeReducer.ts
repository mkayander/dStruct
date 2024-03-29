import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";
import {
  type BaseStructureItem,
  type BaseStructureState,
  getBaseStructureReducers,
  getInitialDataBase,
  getStateByName,
  type NamedPayload,
  runStateActionByName,
  type StructureNode,
} from "#/store/reducers/structures/baseStructureReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

export type AnimationName = "blink";

export type TreeNodeData = StructureNode & {
  argType: ArgumentTreeType;
  depth: number;
  childrenIds: (string | undefined)[];
  x: number;
  y: number;
};

export type TreeData = BaseStructureItem<TreeNodeData> & {
  type: ArgumentTreeType;
  order: number;
  maxDepth: number;
  rootId: string | null;
};

export type TreeDataState = BaseStructureState<TreeData>;

const treeNodeDataAdapter = createEntityAdapter<TreeNodeData>();

const getInitialData = (type: ArgumentTreeType, order: number): TreeData => ({
  ...getInitialDataBase(treeNodeDataAdapter),
  type,
  order,
  maxDepth: 0,
  rootId: null,
});
const initialState: TreeDataState = {};

const deleteTreeNode = (
  state: TreeDataState,
  treeName: string,
  treeState: TreeData,
  id: string,
) => {
  if (!(id in treeState.nodes.entities)) return;

  const count = treeState.nodes.ids.length;
  if (count === 1) {
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

          deleteTreeNode(state, childTreeName, childTreeState, childId);
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
        childrenIds[index] = childId;
        treeNodeDataAdapter.updateOne(treeState.nodes, {
          id,
          changes: { childrenIds },
        });
      });
    },
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
 * Reducer
 */
export const treeNodeReducer = treeNodeSlice.reducer;

/**
 * Selector
 */
export const treeDataSelector = (state: RootState) => state.treeNode;

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
