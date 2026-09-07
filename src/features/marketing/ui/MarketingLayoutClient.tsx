"use client";

import React, { type ReactNode, useEffect } from "react";

import { appBarSlice } from "#/features/appBar/model/appBarSlice";
import {
  MarketingScrollProvider,
  useMarketingScrollViewport,
  useMarketingScrollViewportRef,
} from "#/features/marketing/context/MarketingScrollContext";
import { useRoutePathname } from "#/shared/hooks";
import { MainLayout } from "#/shared/ui/templates/MainLayout";
import { useAppDispatch } from "#/store/hooks";

type MarketingLayoutChromeProps = {
  children: ReactNode;
};

/**
 * Persistent marketing chrome — survives instant navigations between `/` and
 * `/privacy` so {@link PageScrollContainer} keeps driving app bar scroll state.
 */
const MarketingLayoutChrome: React.FC<MarketingLayoutChromeProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const pathname = useRoutePathname();
  const pageScrollViewport = useMarketingScrollViewport();
  const setPageScrollViewport = useMarketingScrollViewportRef();

  // Reset scroll position and app bar state when switching marketing routes.
  useEffect(() => {
    if (!pageScrollViewport) {
      dispatch(appBarSlice.actions.setIsScrolled(false));
      return;
    }

    pageScrollViewport.scrollTo(0, 0);
    dispatch(appBarSlice.actions.setIsScrolled(false));
  }, [dispatch, pageScrollViewport, pathname]);

  return (
    <MainLayout
      headerPosition="fixed"
      pageScrollViewportRef={setPageScrollViewport}
    >
      {children}
    </MainLayout>
  );
};

type MarketingLayoutClientProps = {
  children: ReactNode;
};

export const MarketingLayoutClient: React.FC<MarketingLayoutClientProps> = ({
  children,
}) => (
  <MarketingScrollProvider>
    <MarketingLayoutChrome>{children}</MarketingLayoutChrome>
  </MarketingScrollProvider>
);
