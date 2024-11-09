import { combineReducers } from "redux";

import { caseSlice } from "#/entities/argument/model/caseSlice";
import { arrayStructureSlice } from "#/entities/dataStructures/array/model/arraySlice";
import { treeNodeSlice } from "#/entities/dataStructures/node/model/nodeSlice";
import { appBarSlice } from "#/features/appBar/model/appBarSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import { projectSlice } from "#/features/project/model/projectSlice";
import { editorSlice } from "#/features/treeViewer/model/editorSlice";

/**
 * Combine reducers
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript
 */
export const rootReducer = combineReducers({
  appBar: appBarSlice.reducer,
  treeNode: treeNodeSlice.reducer,
  arrayStructure: arrayStructureSlice.reducer,
  callstack: callstackSlice.reducer,
  project: projectSlice.reducer,
  editor: editorSlice.reducer,
  testCase: caseSlice.reducer,
});
