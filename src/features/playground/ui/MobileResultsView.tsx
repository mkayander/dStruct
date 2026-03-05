"use client";

import { Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

import { OutputPanel } from "#/features/output/ui/OutputPanel";
import { TreeViewPanel } from "#/features/treeViewer/ui/TreeViewPanel";
import { useI18nContext } from "#/shared/hooks";

import { CollapsiblePanel, CollapsiblePanelToggle } from "./CollapsiblePanel";
import { MOBILE_PHASE_NAV_HEIGHT } from "./MobilePhaseNavBar";

export const MobileResultsView: React.FC = () => {
  const { LL } = useI18nContext();
  const [outputCollapsed, setOutputCollapsed] = useState(true);
  const [outputTab, setOutputTab] = useState("1");

  const outputHeader = (
    <Typography variant="caption" fontWeight={600}>
      {LL.OUTPUT()}
    </Typography>
  );

  const handleOutputToggle = () => {
    setOutputCollapsed((state) => !state);
  };

  const handleOutputTabChange = (newValue: string) => {
    setOutputTab(newValue);
    setOutputCollapsed(false);
  };

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

      <Box
        sx={{
          mt: 1,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <CollapsiblePanel
          header={outputHeader}
          collapsed={outputCollapsed}
          onToggle={setOutputCollapsed}
          hideHeaderRow
          collapsedContent={
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                width: "100%",
                minHeight: 52,
                paddingBottom: `calc(${MOBILE_PHASE_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <OutputPanel
                  headerOnly
                  value={outputTab}
                  onTabChange={handleOutputTabChange}
                  onTabBarClick={() => setOutputCollapsed(false)}
                />
              </Box>
              <CollapsiblePanelToggle
                isCollapsed={true}
                onToggle={handleOutputToggle}
                aria-label="Expand output"
              />
            </Stack>
          }
        >
          <Box sx={{ height: "40vh", minHeight: 0, overflow: "hidden" }}>
            <OutputPanel
              value={outputTab}
              onTabChange={setOutputTab}
              trailingHeaderActions={
                <CollapsiblePanelToggle
                  isCollapsed={outputCollapsed}
                  onToggle={handleOutputToggle}
                  aria-label={
                    outputCollapsed ? "Expand output" : "Collapse output"
                  }
                />
              }
            />
          </Box>
        </CollapsiblePanel>
      </Box>
    </Box>
  );
};
