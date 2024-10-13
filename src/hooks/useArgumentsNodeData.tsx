import { useAppDispatch, useAppStore } from "#/store/hooks";
import { type RootState } from "#/store/makeStore";
import { caseSlice } from "#/store/reducers/caseReducer";
import {
  ArgumentType,
  isArgumentTreeType,
  type TreeArgumentData,
} from "#/utils/argumentObject";
import { trpc } from "#/utils/trpc";

function* iterateGraphStructures(state: RootState) {
  for (const treeName in state.treeNode) {
    const treeState = state.treeNode[treeName];
    if (!treeState || treeState.type !== ArgumentType.GRAPH) continue;

    const caseArg = state.testCase.args.entities[treeName];
    if (!caseArg) {
      console.error(`Case argument ${treeName} not found`);
      continue;
    }
    if (!isArgumentTreeType(caseArg)) continue;

    yield { treeName, treeState, caseArg };
  }
}

export const useArgumentsNodeData = () => {
  const store = useAppStore();
  const dispatch = useAppDispatch();

  const updateCase = trpc.project.updateCase.useMutation();

  const saveGraphNodePositions = async () => {
    const state = store.getState();

    for (const { treeName, treeState, caseArg } of iterateGraphStructures(
      state,
    )) {
      const dataMap: TreeArgumentData["nodeData"] = {};

      for (const nodeId in treeState.nodes.entities) {
        const node = treeState.nodes.entities[nodeId];
        if (!node) continue;

        const { x, y } = node;
        if (!node.value) continue;
        dataMap[node.value] = { x, y };
      }

      const projectId = state.testCase.projectId;
      const caseId = state.testCase.caseId;
      const args = state.testCase.args.entities;
      if (!projectId || !caseId || !args) continue;

      await updateCase.mutateAsync({
        projectId,
        caseId,
        args: {
          ...args,
          [treeName]: {
            ...caseArg,
            nodeData: dataMap,
          },
        },
      });
      dispatch(
        caseSlice.actions.updateNodeData({
          ...caseArg,
          nodeData: dataMap,
        }),
      );
    }
  };

  const clearGraphNodePositions = async () => {
    const state = store.getState();

    for (const { treeName } of iterateGraphStructures(state)) {
      const projectId = state.testCase.projectId;
      const caseId = state.testCase.caseId;
      const args = state.testCase.args.entities;
      if (!projectId || !caseId || !args) continue;

      // await updateCase.mutateAsync({
      //   projectId,
      //   caseId,
      //   args: {
      //     ...args,
      //     [treeName]: {
      //       ...caseArg,
      //       nodeData: {},
      //     },
      //   },
      // });
      dispatch(caseSlice.actions.clearNodeData(treeName));
    }
  };

  return {
    saveGraphNodePositions,
    clearGraphNodePositions,
  };
};
