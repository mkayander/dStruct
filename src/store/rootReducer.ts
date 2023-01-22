import { combineReducers } from 'redux';

import { callstackReducer } from '#/store/reducers/callstackReducer';
import { counterReducer } from '#/store/reducers/counterReducer';
import { projectReducer } from '#/store/reducers/projectReducer';
import { treeNodeReducer } from '#/store/reducers/treeNodeReducer';

/**
 * Combine reducers
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript
 */
export const rootReducer = combineReducers({
  counter: counterReducer,
  treeNode: treeNodeReducer,
  callstack: callstackReducer,
  project: projectReducer,
});
