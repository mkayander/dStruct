"use client";

import { Box, Skeleton } from "@mui/material";
import React from "react";

import { MOBILE_APPBAR_HEIGHT } from "#/features/appBar/constants";
import { usePlaygroundMobileLayout } from "#/features/playground/hooks/usePlaygroundMobileLayout";
import { SplitPanelsLayoutSkeleton } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutSkeleton";

const MobilePlaygroundPanelsSkeleton: React.FC = () => (
  <Box
    component="main"
    sx={{
      height: `calc(100vh - ${MOBILE_APPBAR_HEIGHT}px - env(safe-area-inset-top, 0px))`,
      px: 1,
      pb: 1,
      overflow: "hidden",
    }}
  >
    <Skeleton
      variant="rounded"
      animation="wave"
      sx={{ height: "100%", borderRadius: 2, cursor: "wait" }}
    />
  </Box>
);

/** Playground panel-area skeleton (desktop split layout or mobile full-bleed). */
export const PlaygroundPanelsSkeleton: React.FC = () => {
  const isMobile = usePlaygroundMobileLayout();

  if (isMobile) {
    return <MobilePlaygroundPanelsSkeleton />;
  }

  return <SplitPanelsLayoutSkeleton />;
};
