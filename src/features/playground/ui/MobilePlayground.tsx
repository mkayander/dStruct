"use client";

import { Box } from "@mui/material";
import React from "react";

import { useMobilePlaygroundView } from "../hooks/useMobilePlaygroundView";
import { MobileBrowseView } from "./MobileBrowseView";
import { MobileCodeView } from "./MobileCodeView";
import { MobileResultsView } from "./MobileResultsView";

export const MOBILE_APPBAR_HEIGHT = 48;

export const MobilePlayground: React.FC = () => {
  const { currentView, goToResults } = useMobilePlaygroundView();

  return (
    <Box
      component="main"
      sx={{
        height: `calc(100vh - ${MOBILE_APPBAR_HEIGHT}px)`,
        overflow: "hidden",
      }}
    >
      {currentView === "browse" && <MobileBrowseView />}
      {currentView === "code" && <MobileCodeView onRunComplete={goToResults} />}
      {currentView === "results" && <MobileResultsView />}
    </Box>
  );
};
