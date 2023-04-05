import type { AppDispatch } from "#/store/makeStore";
import { arrayStructureSlice } from "#/store/reducers/structures/arrayReducer";
import { treeNodeSlice } from "#/store/reducers/structures/treeNodeReducer";

export const resetStructuresState = (dispatch: AppDispatch) => {
  [treeNodeSlice, arrayStructureSlice].forEach((slice) => {
    dispatch(slice.actions.backupAllNodes());
    dispatch(slice.actions.resetAll()); // Reset all nodes to default
  });
};
