"use client";

import React from "react";
import { Provider } from "react-redux";

import { makeStore } from "#/store/makeStore";

const store = makeStore();

export const ReduxProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};
