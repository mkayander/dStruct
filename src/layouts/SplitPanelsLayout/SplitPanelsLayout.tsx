"use client";

import { Box } from "@mui/material";
import React, { useState } from "react";
import { Panel, PanelGroup, type PanelProps } from "react-resizable-panels";

import { ResizeHandle } from "#/components/atoms/ResizeHandle";

export type SplitPanelsLayoutProps = {
  TopLeft: PanelContent;
  TopRight: PanelContent;
  BottomLeft: PanelContent;
  BottomRight: PanelContent;
};

export type PanelContentProps = {
  verticalSize?: number;
};
type PanelContent = React.FC<PanelContentProps>;

type ControlledPanelProps = PanelProps & {
  Child: PanelContent;
};

const ControlledPanel: React.FC<ControlledPanelProps> = ({
  Child,
  ...restProps
}) => {
  const [size, setSize] = useState(0);

  return (
    <Panel
      onResize={(size) => {
        setSize(size);
      }}
      {...restProps}
    >
      {<Child verticalSize={size} />}
    </Panel>
  );
};

export const SplitPanelsLayout: React.FC<SplitPanelsLayoutProps> = ({
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}) => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 70px)",
        width: "100vw",
        p: 1,
        overflow: "hidden",
      }}
    >
      <PanelGroup autoSaveId="main-horizontal" direction="horizontal">
        <Panel defaultSize={60} order={1}>
          <PanelGroup autoSaveId="main-vertical-left" direction="vertical">
            <ControlledPanel defaultSize={30} order={1} Child={TopLeft} />
            <ResizeHandle />
            <ControlledPanel order={2} Child={BottomLeft} />
          </PanelGroup>
        </Panel>
        <ResizeHandle />
        <Panel order={2}>
          <PanelGroup autoSaveId="main-vertical-right" direction="vertical">
            <ControlledPanel order={1} defaultSize={80} Child={TopRight} />
            <ResizeHandle />
            <ControlledPanel order={2} Child={BottomRight} />
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </Box>
  );
};
