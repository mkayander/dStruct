import {
  type Action,
  type AnyAction,
  configureStore,
  type Middleware,
  type ThunkAction,
} from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import logger from "redux-logger";

import { rootReducer } from "#/store/rootReducer";

export type RootState = ReturnType<typeof rootReducer>;

const reducer = (
  state: RootState | undefined,
  action: AnyAction
): RootState => {
  if (action.type === HYDRATE) {
    // Attention! This will overwrite client state! Real apps should use proper reconciliation.
    return {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
  } else {
    return rootReducer(state, action);
  }
};

const additionalMiddleware: Middleware[] = [];
if (process.env.NODE_ENV !== "production") {
  additionalMiddleware.push(logger);
}

export const makeStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        // .prepend(
        //   // correctly typed middlewares can just be used
        //   additionalMiddleware,
        //   // you can also type middlewares manually
        //   untypedMiddleware as Middleware<
        //     (action: Action<'specialAction'>) => number,
        //     RootState
        //   >
        // )
        // prepend and concat calls can be chained
        .concat(additionalMiddleware),
  });

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store["dispatch"];
// export type RootState = ReturnType<Store['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== "production",
});
