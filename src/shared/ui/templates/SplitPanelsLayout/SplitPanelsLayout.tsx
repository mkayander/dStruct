"use client";

import { Box } from "@mui/material";
import React, { useState } from "react";
import { Group, Panel, type PanelProps } from "react-resizable-panels";

import { ResizeHandle } from "#/shared/ui/atoms/ResizeHandle";

export type SplitPanelsLayoutProps = {
  component?: "div" | "section" | "main" | "article" | "aside";
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
        setSize(size.asPercentage);
      }}
      {...restProps}
    >
      {<Child verticalSize={size} />}
    </Panel>
  );
};

export const SplitPanelsLayout: React.FC<SplitPanelsLayoutProps> = ({
  component = "div",
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}) => {
  return (
    <Box
      component={component}
      sx={{
        height: "calc(100vh - 57px)",
        width: "100vw",
        px: 1,
        pb: 1,
        overflow: "hidden",
      }}
    >
      <Group autoSave="main-horizontal" orientation="horizontal">
        <Panel defaultSize={60}>
          <Group autoSave="main-vertical-left" orientation="vertical">
            <ControlledPanel defaultSize={15} Child={TopLeft} />
            <ResizeHandle />
            <ControlledPanel defaultSize={30} Child={BottomLeft} />
          </Group>
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={40}>
          <Group autoSave="main-vertical-right" orientation="vertical">
            <ControlledPanel defaultSize={80} Child={TopRight} />
            <ResizeHandle />
            <ControlledPanel defaultSize={30} Child={BottomRight} />
          </Group>
        </Panel>
      </Group>
    </Box>
  );
};
