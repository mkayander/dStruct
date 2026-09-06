"use client";

import { darken, useTheme } from "@mui/material";
import React, { type ReactNode } from "react";

import { MainAppBar } from "#/features/appBar/ui/MainAppBar";
import { usePlaygroundMobileLayout } from "#/features/playground/hooks/usePlaygroundMobileLayout";
import { PageScrollContainer } from "#/shared/ui/templates/PageScrollContainer";

type PlaygroundPageShellProps = {
  children: ReactNode;
};

/**
 * Shared chrome for playground routes: scroll container, background, and app bar.
 * Used by the live page and route `loading.tsx` so instant navigations keep the header.
 */
export const PlaygroundPageShell: React.FC<PlaygroundPageShellProps> = ({
  children,
}) => {
  const theme = useTheme();
  const isMobile = usePlaygroundMobileLayout();

  return (
    <PageScrollContainer
      isPage={true}
      options={
        isMobile
          ? { overflow: { x: "hidden", y: "hidden" } }
          : { scrollbars: { autoHide: "scroll" }, overflow: { x: "hidden" } }
      }
      style={{
        height: "100vh",
        background: darken(theme.palette.background.default, 0.1),
      }}
    >
      <MainAppBar toolbarVariant="dense" />
      {children}
    </PageScrollContainer>
  );
};
