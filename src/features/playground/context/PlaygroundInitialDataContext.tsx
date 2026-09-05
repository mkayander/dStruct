"use client";

import React, { createContext, type ReactNode, useContext } from "react";

import type { PlaygroundInitialData } from "#/server/playground/getPlaygroundInitialData";

const PlaygroundInitialDataContext =
  createContext<PlaygroundInitialData | null>(null);

type PlaygroundInitialDataProviderProps = {
  initialData: PlaygroundInitialData;
  children: ReactNode;
};

export const PlaygroundInitialDataProvider: React.FC<
  PlaygroundInitialDataProviderProps
> = ({ initialData, children }) => (
  <PlaygroundInitialDataContext.Provider value={initialData}>
    {children}
  </PlaygroundInitialDataContext.Provider>
);

export const usePlaygroundInitialData = (): PlaygroundInitialData | null =>
  useContext(PlaygroundInitialDataContext);
