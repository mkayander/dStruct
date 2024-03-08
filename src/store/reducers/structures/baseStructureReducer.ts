import type {
  EntityAdapter,
  EntityState,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";

export type AnimationName = "blink";

export type StructureNode = {
  id: string;
  value?: string | number;
  childName?: string;
  color?: string;
  info?: Record<string, any>;
  animation?: AnimationName;
  isHighlighted?: boolean;
};

export type BaseStructureItem<N extends StructureNode = StructureNode> = {
  nodes: EntityState<N, string>;
  initialNodes: EntityState<N, string> | null;
  isRuntime: boolean;
  isNested?: boolean;
  hasNested?: boolean;
  colorMap?: Record<string | number, string>;
};

export const getInitialDataBase = <N extends StructureNode>(
  adapter: EntityAdapter<N, string>,
): BaseStructureItem<N> => ({
  nodes: adapter.getInitialState(),
  initialNodes: null,
  isRuntime: false,
});

export type BaseStructureState<
  T extends BaseStructureItem = BaseStructureItem,
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
  name: K,
): T[K] | null => {
  const treeState = state[name];
  if (!treeState) {
    return null;
  }

  return treeState;
};

export const runStateActionByName = <
  T extends BaseStructureState,
  K extends keyof T,
>(
  state: T,
  name: K,
  action: (treeState: T[K]) => void,
) => {
  const treeState = getStateByName(state, name);
  if (!treeState) return;

  action(treeState);
};

export const getBaseStructureReducers = <N extends StructureNode>(
  adapter: EntityAdapter<any, string>,
) => {
  const selectors = adapter.getSelectors();

  const resetNodes = <T extends BaseStructureState>(state: T[string]) => {
    if (state.isRuntime) adapter.removeAll(state.nodes);
    if (state.initialNodes === null) return;

    adapter.removeAll(state.nodes);
    adapter.addMany(state.nodes, selectors.selectAll(state.initialNodes));
    state.colorMap = {};
  };

  return {
    add: <T extends BaseStructureState>(state: T, action: NamedPayload<N>) => {
      const childName = action.payload.data.childName;

      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: {
            data: { id, ...node },
          },
        } = action;

        adapter.addOne(treeState.nodes, { id, ...node });
        if (childName) {
          treeState.hasNested = true;
        }
      });

      if (childName) {
        runStateActionByName(state, childName, (treeState) => {
          treeState.isNested = true;
        });
      }
    },
    addMany: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<N[]>,
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: { data: nodes },
        } = action;

        for (const node of nodes) {
          const childName = node.childName;
          if (!childName) continue;

          treeState.hasNested = true;
          runStateActionByName(state, childName, (childTreeState) => {
            childTreeState.isNested = true;
          });
        }

        adapter.addMany(treeState.nodes, nodes);
      }),
    update: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<Update<N, string>>,
    ) => {
      const childName = action.payload.data.changes.childName;

      runStateActionByName(state, action.payload.name, (treeState) => {
        adapter.updateOne(treeState.nodes, action.payload.data);
        if (childName) {
          treeState.hasNested = true;
        }
      });

      if (childName) {
        runStateActionByName(state, childName, (treeState) => {
          treeState.isNested = true;
        });
      }
    },
    remove: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<Pick<N, "id">>,
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        adapter.removeOne(treeState.nodes, action.payload.data.id);
      }),
    clear: <T extends BaseStructureState>(state: T, action: NamedPayload) => {
      delete state[action.payload.name];
    },
    clearMany: <T extends BaseStructureState>(
      state: T,
      action: PayloadAction<string[]>,
    ) => {
      for (const name of action.payload) {
        delete state[name];
      }
    },
    clearAll: () => {
      return {};
    },
    setColorMap: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<Pick<BaseStructureItem, "colorMap"> | null>,
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        if (action.payload.data === null) {
          treeState.colorMap = {};
          return;
        }

        treeState.colorMap = action.payload.data.colorMap;
      }),
    backupAllNodes: <T extends BaseStructureState>(state: T) => {
      for (const name in state) {
        runStateActionByName(state, name, (treeState) => {
          if (treeState.isRuntime || treeState.initialNodes !== null) return;

          treeState.initialNodes = {
            ...treeState.nodes,
            ids: [...treeState.nodes.ids],
            entities: { ...treeState.nodes.entities },
          };
        });
      }
    },
    reset: <T extends BaseStructureState>(
      state: T,
      action: NamedPayload<undefined>,
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) =>
        resetNodes(treeState),
      ),
    resetAll: <T extends BaseStructureState>(state: T) => {
      for (const name in state) {
        if (state[name]?.isRuntime) {
          delete state[name];
          continue;
        }
        runStateActionByName(state, name, (treeState) => resetNodes(treeState));
      }
    },
  };
};
