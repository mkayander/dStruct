import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { arrayStructureSlice } from "#/store/reducers/structures/arrayReducer";
import { treeNodeSlice } from "#/store/reducers/structures/treeNodeReducer";

export const resetStructuresState = (
  dispatch: AppDispatch,
  performBackup = true,
  clearBackup = false,
) => {
  dispatch(callstackSlice.actions.setIsPlaying(false));
  dispatch(callstackSlice.actions.setFrameIndex(-1));
  [treeNodeSlice, arrayStructureSlice].forEach((slice) => {
    if (performBackup) {
      dispatch(slice.actions.backupAllNodes());
    } else if (clearBackup) {
      dispatch(slice.actions.clearAllBackups());
    }
    dispatch(slice.actions.resetAll()); // Reset all nodes to default
  });
};
