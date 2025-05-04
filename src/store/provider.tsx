"use client";

import React from "react";
import { Provider } from "react-redux";

import { getStore } from "#/store/makeStore";

const store = getStore();

export const ReduxProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};
