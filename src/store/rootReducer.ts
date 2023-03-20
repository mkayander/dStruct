import { combineReducers } from "redux";

import { appBarReducer } from "#/store/reducers/appBarReducer";
import { callstackReducer } from "#/store/reducers/callstackReducer";
import { caseReducer } from "#/store/reducers/caseReducer";
import { projectReducer } from "#/store/reducers/projectReducer";
import { treeNodeReducer } from "#/store/reducers/treeNodeReducer";

/**
 * Combine reducers
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript
 */
export const rootReducer = combineReducers({
  appBar: appBarReducer,
  treeNode: treeNodeReducer,
  callstack: callstackReducer,
  project: projectReducer,
  testCase: caseReducer,
});
