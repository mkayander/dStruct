"use client";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Collapse, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";

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
};

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  header,
  children,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onToggle,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    const next = !isCollapsed;
    setInternalCollapsed(next);
    onToggle?.(next);
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
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
        >
          {isCollapsed ? (
            <ExpandMore fontSize="small" />
          ) : (
            <ExpandLess fontSize="small" />
          )}
        </IconButton>
      </Stack>
      <Collapse in={!isCollapsed} timeout={200} unmountOnExit={false}>
        {children}
      </Collapse>
    </Box>
  );
};

CollapsiblePanel.displayName = "CollapsiblePanel";
