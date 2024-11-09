import { arrayStructureSlice } from "#/entities/dataStructures/array/model/arraySlice";
import { treeNodeSlice } from "#/entities/dataStructures/node/model/nodeSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import type { AppDispatch } from "#/store/makeStore";

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
