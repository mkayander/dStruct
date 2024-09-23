import type { AppDispatch } from "#/store/makeStore";
import { arrayStructureSlice } from "#/store/reducers/structures/arrayReducer";
import { treeNodeSlice } from "#/store/reducers/structures/treeNodeReducer";

export const resetStructuresState = (
  dispatch: AppDispatch,
  performBackup = true,
) => {
  [treeNodeSlice, arrayStructureSlice].forEach((slice) => {
    if (performBackup) {
      dispatch(slice.actions.backupAllNodes());
    }
    dispatch(slice.actions.resetAll()); // Reset all nodes to default
  });
};
