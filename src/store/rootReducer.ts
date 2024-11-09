import { combineReducers } from "redux";

import { caseSlice } from "#/entities/argument/model/caseSlice";
import { appBarSlice } from "#/features/appBar/model/appBarSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import { projectSlice } from "#/features/project/model/projectSlice";
import { editorSlice } from "#/features/treeViewer/model/editorSlice";
import { arrayStructureReducer } from "#/store/reducers/structures/arrayReducer";
import { treeNodeReducer } from "#/store/reducers/structures/treeNodeReducer";

/**
 * Combine reducers
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript
 */
export const rootReducer = combineReducers({
  appBar: appBarSlice.reducer,
  treeNode: treeNodeReducer,
  arrayStructure: arrayStructureReducer,
  callstack: callstackSlice.reducer,
  project: projectSlice.reducer,
  editor: editorSlice.reducer,
  testCase: caseSlice.reducer,
});
