"use client";

import { Box, Typography } from "@mui/material";
import React from "react";

import { OutputPanel } from "#/features/output/ui/OutputPanel";
import { TreeViewPanel } from "#/features/treeViewer/ui/TreeViewPanel";
import { useI18nContext } from "#/shared/hooks";

import { CollapsiblePanel } from "./CollapsiblePanel";

export const MobileResultsView: React.FC = () => {
  const { LL } = useI18nContext();

  const outputHeader = (
    <Typography variant="caption" fontWeight={600}>
      {LL.OUTPUT()}
    </Typography>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <TreeViewPanel />
      </Box>

      <CollapsiblePanel header={outputHeader} defaultCollapsed>
        <Box sx={{ maxHeight: "40vh", overflow: "hidden" }}>
          <OutputPanel />
        </Box>
      </CollapsiblePanel>
    </Box>
  );
};
