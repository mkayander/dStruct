import { useSnackbar } from "notistack";

import { useAppDispatch, useAppSelector, useAppStore } from "#/store/hooks";
import { type RootState } from "#/store/makeStore";
import { caseSlice } from "#/store/reducers/caseReducer";
import { selectIsEditable } from "#/store/reducers/projectReducer";
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
  const { enqueueSnackbar } = useSnackbar();
  const isEditable = useAppSelector(selectIsEditable);

  const trpcUtils = trpc.useUtils();
  const updateCase = trpc.project.updateCase.useMutation({
    onSuccess: (data) => {
      trpcUtils.project.getCaseBySlug.setData(
        { projectId: data.projectId, slug: data.slug },
        data,
      );
    },
  });

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

      if (isEditable) {
        try {
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
        } catch (error: unknown) {
          if (error instanceof Error) {
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          }
          console.error("Failed to save graph node data on server", error);
        }
      }

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

      dispatch(caseSlice.actions.clearNodeData(treeName));
    }
  };

  return {
    saveGraphNodePositions,
    clearGraphNodePositions,
  };
};
