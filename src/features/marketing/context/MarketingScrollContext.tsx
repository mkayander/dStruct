"use client";

import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type MarketingScrollContextValue = {
  pageScrollViewport: HTMLDivElement | null;
  setPageScrollViewport: (viewport: HTMLDivElement | null) => void;
};

const MarketingScrollContext =
  createContext<MarketingScrollContextValue | null>(null);

export const MarketingScrollProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pageScrollViewport, setPageScrollViewport] =
    useState<HTMLDivElement | null>(null);

  const value = useMemo(
    () => ({
      pageScrollViewport,
      setPageScrollViewport,
    }),
    [pageScrollViewport],
  );

  return (
    <MarketingScrollContext.Provider value={value}>
      {children}
    </MarketingScrollContext.Provider>
  );
};

export const useMarketingScrollViewport = (): HTMLDivElement | null => {
  const context = useContext(MarketingScrollContext);
  return context?.pageScrollViewport ?? null;
};

export const useMarketingScrollViewportRef = (): ((
  viewport: HTMLDivElement | null,
) => void) => {
  const context = useContext(MarketingScrollContext);
  if (!context) {
    throw new Error(
      "useMarketingScrollViewportRef must be used within MarketingScrollProvider",
    );
  }
  return context.setPageScrollViewport;
};
