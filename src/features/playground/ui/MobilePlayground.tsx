"use client";

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useMobilePlaygroundView } from "../hooks/useMobilePlaygroundView";
import { MobileBrowseView } from "./MobileBrowseView";
import { MobileCodeView } from "./MobileCodeView";
import { MobileResultsView } from "./MobileResultsView";

export const MOBILE_APPBAR_HEIGHT = 48;

const hiddenSx = { display: "none" } as const;
const visibleSx = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
} as const;

export const MobilePlayground: React.FC = () => {
  const { currentView, goToResults } = useMobilePlaygroundView();

  const [mounted, setMounted] = useState({
    browse: currentView === "browse",
    code: currentView === "code",
    results: currentView === "results",
  });

  useEffect(() => {
    setMounted((prev) => {
      if (prev[currentView]) return prev;
      return { ...prev, [currentView]: true };
    });
  }, [currentView]);

  return (
    <Box
      component="main"
      sx={{
        height: `calc(100vh - ${MOBILE_APPBAR_HEIGHT}px)`,
        overflow: "hidden",
      }}
    >
      {mounted.browse && (
        <Box sx={currentView === "browse" ? visibleSx : hiddenSx}>
          <MobileBrowseView />
        </Box>
      )}
      {mounted.code && (
        <Box sx={currentView === "code" ? visibleSx : hiddenSx}>
          <MobileCodeView onRunComplete={goToResults} />
        </Box>
      )}
      {mounted.results && (
        <Box sx={currentView === "results" ? visibleSx : hiddenSx}>
          <MobileResultsView />
        </Box>
      )}
    </Box>
  );
};
