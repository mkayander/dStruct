"use client";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Collapse, IconButton, Stack, useTheme } from "@mui/material";
import React, { useState } from "react";

import { iconButtonHoverSx } from "#/shared/ui/styles/iconButtonHoverStyles";

const HEADER_HEIGHT = 44;

type CollapsiblePanelProps = {
  /** Content rendered in the always-visible header bar */
  header: React.ReactNode;
  children: React.ReactNode;
  /** Whether the panel starts collapsed */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state (overrides internal state) */
  collapsed?: boolean;
  /** Called when the collapse toggle is clicked */
  onToggle?: (collapsed: boolean) => void;
  /** When true, hide the header row. Toggle must be rendered elsewhere (e.g. in parent header). Requires controlled mode (collapsed + onToggle). */
  hideHeaderRow?: boolean;
  /** Content to render when collapsed (e.g. tab bar that expands on click). Replaces the minimal expand button. */
  collapsedContent?: React.ReactNode;
};

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  header,
  children,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onToggle,
  hideHeaderRow = false,
  collapsedContent,
}) => {
  const theme = useTheme();
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    const next = !isCollapsed;
    setInternalCollapsed(next);
    onToggle?.(next);
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      {!hideHeaderRow && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            height: HEADER_HEIGHT,
            px: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>{header}</Box>
          <IconButton
            size="small"
            onClick={handleToggle}
            aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
            aria-expanded={!isCollapsed}
            sx={iconButtonHoverSx(theme)}
          >
            {isCollapsed ? (
              <ExpandMore fontSize="small" />
            ) : (
              <ExpandLess fontSize="small" />
            )}
          </IconButton>
        </Stack>
      )}
      {hideHeaderRow && isCollapsed && (
        <Box
          sx={{
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {collapsedContent ?? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ height: 36 }}
            >
              <IconButton
                size="small"
                onClick={handleToggle}
                aria-label="Expand panel"
                aria-expanded={false}
                sx={iconButtonHoverSx(theme)}
              >
                <ExpandMore fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Box>
      )}
      <Collapse in={!isCollapsed} timeout={200} unmountOnExit={false}>
        {children}
      </Collapse>
    </Box>
  );
};

CollapsiblePanel.displayName = "CollapsiblePanel";

export type CollapsiblePanelToggleProps = {
  isCollapsed: boolean;
  onToggle: () => void;
  "aria-label"?: string;
};

export const CollapsiblePanelToggle: React.FC<CollapsiblePanelToggleProps> = ({
  isCollapsed,
  onToggle,
  "aria-label": ariaLabel,
}) => {
  const theme = useTheme();
  return (
    <IconButton
      size="small"
      onClick={onToggle}
      aria-label={
        ariaLabel ?? (isCollapsed ? "Expand panel" : "Collapse panel")
      }
      aria-expanded={!isCollapsed}
      sx={iconButtonHoverSx(theme)}
    >
      {isCollapsed ? (
        <ExpandLess fontSize="small" />
      ) : (
        <ExpandMore fontSize="small" />
      )}
    </IconButton>
  );
};
