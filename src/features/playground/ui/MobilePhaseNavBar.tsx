"use client";

import { Box, Tab, Tabs, useTheme } from "@mui/material";
import React from "react";

import { selectCallstackIsReady } from "#/features/callstack/model/callstackSlice";
import { VIEW_LABEL_KEYS } from "#/features/playground/constants/playgroundViewLabels";
import { useMobilePlaygroundView } from "#/features/playground/hooks/useMobilePlaygroundView";
import {
  isPlaygroundView,
  PLAYGROUND_VIEWS,
} from "#/features/playground/model/playgroundView";
import { useI18nContext } from "#/shared/hooks";
import { glassOverlaySx } from "#/shared/ui/styles/glassOverlayStyles";
import { useAppSelector } from "#/store/hooks";

const NAV_BAR_HEIGHT = 38;
/** Matches the nav shell’s top corners (`borderRadius` on the outer `Box`). */
const NAV_BAR_TOP_CORNER_RADIUS_PX = 12;

export const MOBILE_PHASE_NAV_HEIGHT = NAV_BAR_HEIGHT;

export const MobilePhaseNavBar: React.FC = () => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const { currentView, hasProjectSlug, goToBrowse, goToCode, goToResults } =
    useMobilePlaygroundView();
  const hasResults = useAppSelector(selectCallstackIsReady);

  const handleChange = (_: React.SyntheticEvent, raw: string) => {
    if (!isPlaygroundView(raw)) return;
    if (raw === "browse") goToBrowse();
    else if (raw === "code") goToCode();
    else goToResults();
  };

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
        alignItems: "stretch",
        borderRadius: `${NAV_BAR_TOP_CORNER_RADIUS_PX}px ${NAV_BAR_TOP_CORNER_RADIUS_PX}px 0 0`,
        ...glassOverlaySx(theme),
        border: "none",
      }}
    >
      <Tabs
        value={currentView}
        onChange={handleChange}
        variant="fullWidth"
        aria-label={LL.PLAYGROUND()}
        sx={{
          minHeight: NAV_BAR_HEIGHT,
          width: "100%",
          "& .MuiTabs-flexContainer": {
            alignItems: "stretch",
            minHeight: NAV_BAR_HEIGHT,
          },
          "& .MuiTab-root": {
            minHeight: NAV_BAR_HEIGHT,
            py: 0,
            px: 0.5,
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
            overflow: "hidden",
          },
          "& .MuiTab-root:first-of-type": {
            borderTopLeftRadius: `${NAV_BAR_TOP_CORNER_RADIUS_PX}px`,
          },
          "& .MuiTab-root:last-of-type": {
            borderTopRightRadius: `${NAV_BAR_TOP_CORNER_RADIUS_PX}px`,
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: "2px 2px 0 0",
          },
        }}
      >
        {PLAYGROUND_VIEWS.map((view) => (
          <Tab
            key={view}
            value={view}
            label={LL[VIEW_LABEL_KEYS[view]]()}
            disabled={
              view === "code"
                ? !hasProjectSlug
                : view === "results"
                  ? !hasResults
                  : false
            }
          />
        ))}
      </Tabs>
    </Box>
  );
};
