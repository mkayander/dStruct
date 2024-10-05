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
  color?: string | null;
  animation?: AnimationName | null;
  animationCount?: number;
  info?: Record<string, any>;
  isHighlighted?: boolean;
};

export type BaseStructureItem<N extends StructureNode = StructureNode> = {
  nodes: EntityState<N, string>;
  hiddenNodes: EntityState<N, string>;
  initialNodes: EntityState<N, string> | null;
  isRuntime: boolean;
  isNested?: boolean;
  hasNested?: boolean;
  colorMap?: Record<string | number, string> | null;
};

export const getInitialDataBase = <N extends StructureNode>(
  adapter: EntityAdapter<N, string>,
): BaseStructureItem<N> => ({
  nodes: adapter.getInitialState(),
  hiddenNodes: adapter.getInitialState(),
  initialNodes: null,
  isRuntime: false,
});

export type BaseStructureState<
  T extends BaseStructureItem = BaseStructureItem,
> = Record<string, T>;

export type NamedPayload<T> = PayloadAction<{
  name: string;
  data: T;
}>;

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
  adapter: EntityAdapter<N, string>,
) => {
  type State = BaseStructureState<BaseStructureItem<N>>;
  const selectors = adapter.getSelectors();

  const resetNodes = <T extends State>(state: T[string]) => {
    if (state.isRuntime) adapter.removeAll(state.nodes);
    if (state.initialNodes === null) return;

    adapter.removeAll(state.nodes);
    adapter.addMany(state.nodes, selectors.selectAll(state.initialNodes));
    state.colorMap = {};
  };

  return {
    add: <T extends State>(state: T, action: NamedPayload<N>) => {
      const childName = action.payload.data.childName;

      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          payload: { data },
        } = action;

        adapter.addOne(treeState.nodes, data);
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
    addMany: <T extends State>(state: T, action: NamedPayload<N[]>) =>
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
    update: <T extends State>(
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
    remove: <T extends State>(state: T, action: NamedPayload<Pick<N, "id">>) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        adapter.removeOne(treeState.nodes, action.payload.data.id);
      }),
    clear: <T extends State>(state: T, action: NamedPayload<undefined>) => {
      delete state[action.payload.name];
    },
    clearMany: <T extends State>(state: T, action: PayloadAction<string[]>) => {
      for (const name of action.payload) {
        delete state[name];
      }
    },
    clearAll: () => {
      return {};
    },
    triggerAnimation: <T extends State>(
      state: T,
      action: NamedPayload<{ id: string; animation: N["animation"] }>,
    ) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          data: { id, animation },
        } = action.payload;

        const node = selectors.selectById(treeState.nodes, id);
        if (!node) return;

        adapter.updateOne(treeState.nodes, {
          id,
          changes: {
            animation,
            animationCount: (node.animationCount ?? 0) + 1,
          } as Partial<N>,
        });
      }),
    setColorMap: <T extends State>(
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
    backupAllNodes: <T extends State>(state: T) => {
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
    reset: <T extends State>(state: T, action: NamedPayload<void>) =>
      runStateActionByName(state, action.payload.name, (treeState) =>
        resetNodes(treeState),
      ),
    resetAll: <T extends State>(state: T) => {
      for (const name in state) {
        if (state[name]?.isRuntime) {
          delete state[name];
          continue;
        }
        runStateActionByName(state, name, (treeState) => resetNodes(treeState));
      }
    },
    hide: <T extends State>(state: T, action: NamedPayload<{ id: string }>) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          data: { id },
        } = action.payload;

        const node = selectors.selectById(treeState.nodes, id);
        if (!node) return;

        adapter.removeOne(treeState.nodes, id);
        adapter.addOne(treeState.hiddenNodes, node);
      }),
    reveal: <T extends State>(state: T, action: NamedPayload<{ id: string }>) =>
      runStateActionByName(state, action.payload.name, (treeState) => {
        const {
          data: { id },
        } = action.payload;

        const node = selectors.selectById(treeState.hiddenNodes, id);
        if (!node) return;

        adapter.removeOne(treeState.hiddenNodes, id);
        adapter.addOne(treeState.nodes, node);
      }),
  };
};
