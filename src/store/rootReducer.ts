import { combineReducers } from "redux";

import { appBarSlice } from "#/features/appBar/model/appBarSlice";
import { callstackReducer } from "#/store/reducers/callstackReducer";
import { caseReducer } from "#/store/reducers/caseReducer";
import { projectReducer } from "#/store/reducers/projectReducer";
import { arrayStructureReducer } from "#/store/reducers/structures/arrayReducer";
import { treeNodeReducer } from "#/store/reducers/structures/treeNodeReducer";

import { editorReducer } from "./reducers/editorReducer";

/**
 * Combine reducers
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript
 */
export const rootReducer = combineReducers({
  appBar: appBarSlice.reducer,
  treeNode: treeNodeReducer,
  arrayStructure: arrayStructureReducer,
  callstack: callstackReducer,
  project: projectReducer,
  editor: editorReducer,
  testCase: caseReducer,
});
