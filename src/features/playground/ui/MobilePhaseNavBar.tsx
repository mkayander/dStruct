"use client";

import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

import { selectCallstackIsReady } from "#/features/callstack/model/callstackSlice";
import { VIEW_LABEL_KEYS } from "#/features/playground/constants/playgroundViewLabels";
import { useMobilePlaygroundView } from "#/features/playground/hooks/useMobilePlaygroundView";
import { useI18nContext } from "#/shared/hooks";
import { glassOverlaySx } from "#/shared/ui/styles/glassOverlayStyles";
import { useAppSelector } from "#/store/hooks";

const NAV_BAR_HEIGHT = 38;

export const MOBILE_PHASE_NAV_HEIGHT = NAV_BAR_HEIGHT;

export const MobilePhaseNavBar: React.FC = () => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const router = useRouter();
  const { currentView, hasProjectSlug, goToBrowse, goToCode, goToResults } =
    useMobilePlaygroundView();
  const hasResults = useAppSelector(selectCallstackIsReady);

  const handleBack = () => {
    if (currentView === "browse") void router.push("/");
    else if (currentView === "results") goToCode();
    else if (currentView === "code") goToBrowse();
  };

  const handleForward = () => {
    if (currentView === "browse" && hasProjectSlug) goToCode();
    else if (currentView === "code" && hasResults) goToResults();
  };

  const canGoForward =
    (currentView === "browse" && hasProjectSlug) ||
    (currentView === "code" && hasResults);

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: `calc(${NAV_BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "12px 12px 0 0",
        px: 2,
        ...glassOverlaySx(theme),
        border: "none",
      }}
    >
      <IconButton
        size="small"
        onClick={handleBack}
        aria-label={LL.BACK()}
        sx={{ flexShrink: 0 }}
      >
        <ArrowBack fontSize="small" />
      </IconButton>

      <Typography
        variant="subtitle2"
        noWrap
        sx={{
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "0.75rem",
          color: "text.secondary",
        }}
      >
        {LL[VIEW_LABEL_KEYS[currentView]]()}
      </Typography>

      <IconButton
        size="small"
        onClick={handleForward}
        disabled={!canGoForward}
        aria-label={LL.FORWARD()}
        sx={{ flexShrink: 0 }}
      >
        <ArrowForward fontSize="small" />
      </IconButton>
    </Box>
  );
};
