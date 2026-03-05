"use client";

import { Box } from "@mui/material";
import React from "react";

import { MOBILE_APPBAR_HEIGHT } from "#/features/appBar/constants";

import { useMobilePlaygroundView } from "../hooks/useMobilePlaygroundView";
import { MobileBrowseView } from "./MobileBrowseView";
import { MobileCodeView } from "./MobileCodeView";
import { MobilePhaseNavBar } from "./MobilePhaseNavBar";
import { MobileResultsView } from "./MobileResultsView";

const mainSx = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  transition: "opacity 0.1s ease-in-out",
} as const;
const hiddenSx = { opacity: 0, pointerEvents: "none" } as const;
const visibleSx = { opacity: 1 } as const;

export const MobilePlayground: React.FC = () => {
  const { currentView, goToResults } = useMobilePlaygroundView();

  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        height: `calc(100vh - ${MOBILE_APPBAR_HEIGHT}px - env(safe-area-inset-top, 0px))`,
        overflow: "hidden",
      }}
    >
      <Box
        id="browse-view"
        sx={{ ...mainSx, ...(currentView === "browse" ? visibleSx : hiddenSx) }}
      >
        <MobileBrowseView />
      </Box>
      <Box
        id="code-view"
        sx={{ ...mainSx, ...(currentView === "code" ? visibleSx : hiddenSx) }}
      >
        <MobileCodeView onRunComplete={goToResults} />
      </Box>
      <Box
        id="results-view"
        sx={{
          ...mainSx,
          ...(currentView === "results" ? visibleSx : hiddenSx),
        }}
      >
        <MobileResultsView />
      </Box>
      <MobilePhaseNavBar />
    </Box>
  );
};
