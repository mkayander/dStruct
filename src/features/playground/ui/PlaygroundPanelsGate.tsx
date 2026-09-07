"use client";

import { Box } from "@mui/material";
import React, { type ReactNode } from "react";

import {
  MOBILE_APPBAR_HEIGHT,
  PLAYGROUND_DESKTOP_APP_BAR_HEIGHT,
} from "#/features/appBar/constants";
import { usePlaygroundMobileLayout } from "#/features/playground/hooks/usePlaygroundMobileLayout";
import { usePlaygroundPanelsReady } from "#/features/playground/hooks/usePlaygroundPanelsReady";
import { PlaygroundPanelsSkeleton } from "#/features/playground/ui/PlaygroundPanelsSkeleton";

type PlaygroundPanelsGateProps = {
  children: ReactNode;
};

/**
 * Keeps one continuous panel skeleton from route loading through client hydration.
 * Panels mount underneath (opacity 0) so editors can finish init before reveal.
 */
export const PlaygroundPanelsGate: React.FC<PlaygroundPanelsGateProps> = ({
  children,
}) => {
  const isMobile = usePlaygroundMobileLayout();
  const panelsReady = usePlaygroundPanelsReady();

  const panelAreaMinHeight = isMobile
    ? `calc(100vh - ${MOBILE_APPBAR_HEIGHT}px - env(safe-area-inset-top, 0px))`
    : `calc(100vh - ${PLAYGROUND_DESKTOP_APP_BAR_HEIGHT}px)`;

  return (
    <Box sx={{ position: "relative" }}>
      {!panelsReady ? (
        <Box sx={{ position: "absolute", inset: 0, zIndex: 2 }}>
          <PlaygroundPanelsSkeleton />
        </Box>
      ) : null}
      <Box
        aria-busy={!panelsReady}
        aria-hidden={!panelsReady}
        sx={{
          minHeight: panelAreaMinHeight,
          opacity: panelsReady ? 1 : 0,
          pointerEvents: panelsReady ? "auto" : "none",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
