import type {
  EntityAdapter,
  EntityState,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";

export type AnimationName = "blink";

export type StructureNode = {
  id: string;
  value: string | number;
  color?: string;
  animation?: AnimationName;
  isHighlighted?: boolean;
};

export type BaseStructureItem<N extends StructureNode = StructureNode> = {
  nodes: EntityState<N>;
  initialNodes: EntityState<N>;
};

export type BaseStructureState<
  T extends BaseStructureItem = BaseStructureItem
> = Record<string, T>;

export type NamedPayload<T = void> = PayloadAction<
  T extends void
    ? {
        name: string;
      }
    : {
        name: string;
        data: T;
      }
>;

export const getStateByName = <T extends BaseStructureState, K extends keyof T>(
  state: T,
  name: K
): T[K] | null => {
  const treeState = state[name];
  if (!treeState) {
    // console.warn("getTreeState: Tree state not found: ", {
    //   name,
    //   state,
    //   caller,
    // });
    return null;
  }

  return treeState;
};

export const runStateActionByName = <
  T extends BaseStructureState,
  K extends keyof T
>(
  state: T,
  name: K,
  action: (treeState: T[K]) => void
) => {
  const treeState = getStateByName(state, name);
  if (!treeState) return;

  action(treeState);
};

export const getBaseStructureReducers = (adapter: EntityAdapter<any>) => {
  const selectors = adapter.getSelectors();

  const resetNodes = <T extends BaseStructureState>(state: T[string]) => {
    if (state.initialNodes.ids.length === 0) return;

    adapter.removeAll(state.nodes);
    adapter.addMany(state.nodes, selectors.selectAll(state.initialNodes));
  };

  return {
    add: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<StructureNode>
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: {
            data: { id, ...node },
          },
        } = action;

        adapter.addOne(treeState.nodes, { id, ...node });
      }),
    addMany: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<StructureNode[]>
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: { data: nodes },
        } = action;

        adapter.addMany(treeState.nodes, nodes);
      }),
    update: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<Update<StructureNode>>
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) =>
        adapter.updateOne(treeState.nodes, action.payload.data)
      ),
    remove: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<Pick<StructureNode, "id">>
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        adapter.removeOne(treeState.nodes, action.payload.data.id);
      }),
    clear: <T extends BaseStructureState>(state: T, action: NamedPayload) => {
      delete state[action.payload.name];
    },
    clearMany: <T extends BaseStructureState>(
      state: T,
      action: PayloadAction<string[]>
    ) => {
      for (const name of action.payload) {
        delete state[name];
      }
    },
    clearAll: () => {
      return {};
    },
    backupAllNodes: <T extends BaseStructureState>(state: T) => {
      for (const name in state) {
        runStateActionByName(state, name, (treeState) => {
          if (treeState.initialNodes.ids.length > 0) return;

          adapter.addMany(
            treeState.initialNodes,
            selectors.selectAll(treeState.nodes)
          );
        });
      }
    },
    reset: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<undefined>
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) =>
        resetNodes(treeState)
      ),
    resetAll: <T extends BaseStructureState>(state: T) => {
      for (const name in state) {
        runStateActionByName(state, name, (treeState) => resetNodes(treeState));
      }
    },
  };
};
