"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";

import { useSearchParam } from "#/shared/hooks/useSearchParam";

import {
  PLAYGROUND_VIEW_PARAM_OPTIONS,
  type PlaygroundView,
  type PlaygroundViewParam,
} from "../model/playgroundView";

type PlaygroundViewContextValue = PlaygroundViewParam;

const PlaygroundViewContext = createContext<PlaygroundViewContextValue | null>(
  null,
);

export type PlaygroundViewProviderProps = {
  children: ReactNode;
};

/**
 * Provides a single source of truth for the playground view param.
 * When setView is called, all consumers see the update immediately (no router delay).
 * Use when multiple components need to stay in sync with the view param.
 */
export const PlaygroundViewProvider: React.FC<PlaygroundViewProviderProps> = ({
  children,
}) => {
  const [view, setView] = useSearchParam<PlaygroundView | "">(
    "view",
    PLAYGROUND_VIEW_PARAM_OPTIONS,
  );
  const value: PlaygroundViewContextValue = useMemo(
    () => ({ view, setView }),
    [view, setView],
  );
  return (
    <PlaygroundViewContext.Provider value={value}>
      {children}
    </PlaygroundViewContext.Provider>
  );
};

export const usePlaygroundViewContext = () => useContext(PlaygroundViewContext);
