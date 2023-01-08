import { combineReducers } from 'redux';

import { counterReducer } from '#/store/reducers/counter';
import { treeNodeReducer } from '#/store/reducers/treeNode';

/**
 * Combine reducers
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript
 */
export const rootReducer = combineReducers({
  counter: counterReducer,
  treeNode: treeNodeReducer,
});
