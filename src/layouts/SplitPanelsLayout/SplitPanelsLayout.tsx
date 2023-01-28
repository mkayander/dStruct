import { Box } from "@mui/material";
import React from "react";
import { Panel, PanelGroup } from "react-resizable-panels";

import { ResizeHandle } from "#/components";

type Panel = React.ReactNode | null | undefined;

export type SplitPanelsLayoutProps = {
  children?: [Panel, Panel, Panel, Panel];
};

const style = {};

export const SplitPanelsLayout: React.FC<SplitPanelsLayoutProps> = ({
  children,
}) => {
  const [topLeft, topRight, bottomLeft, bottomRight] =
    React.Children.toArray(children);

  return (
    <Box
      sx={{
        height: "calc(100vh - 69px)",
        width: "100vw",
        p: 1,
        overflow: "hidden",
      }}
    >
      <PanelGroup
        autoSaveId="main-horizontal"
        direction="horizontal"
        style={style}
      >
        <Panel defaultSize={60} order={1} style={style}>
          <PanelGroup
            autoSaveId="main-vertical-left"
            direction="vertical"
            style={style}
          >
            <Panel defaultSize={30} order={1} style={style}>
              {topLeft}
            </Panel>
            <ResizeHandle />
            <Panel order={2} style={style}>
              {bottomLeft}
            </Panel>
          </PanelGroup>
        </Panel>
        <ResizeHandle />
        <Panel order={2} style={style}>
          <PanelGroup
            autoSaveId="main-vertical-right"
            direction="vertical"
            style={style}
          >
            <Panel order={1} defaultSize={80} style={style}>
              {topRight}
            </Panel>
            <ResizeHandle />
            <Panel order={2} style={style}>
              {bottomRight}
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </Box>
  );
};
