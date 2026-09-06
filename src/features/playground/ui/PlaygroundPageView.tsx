"use client";

import React from "react";

import { ConfigContext } from "#/context";
import { CodePanel } from "#/features/codeRunner/ui/CodePanel";
import { OutputPanel } from "#/features/output/ui/OutputPanel";
import { PlaygroundViewProvider } from "#/features/playground/context/PlaygroundViewContext";
import { usePlaygroundMobileLayout } from "#/features/playground/hooks/usePlaygroundMobileLayout";
import { MobilePlayground } from "#/features/playground/ui/MobilePlayground";
import { ProjectPanel } from "#/features/project/ui/ProjectPanel";
import { TreeViewPanel } from "#/features/treeViewer/ui/TreeViewPanel";
import { useAppConfig } from "#/shared/hooks";
import { SplitPanelsLayoutClient } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutClient";

/** Playground shell — desktop split layout or mobile phased UI inside shared chrome. */
export const PlaygroundPageView: React.FC = () => {
  const isMobile = usePlaygroundMobileLayout();

  const { data = {} } = useAppConfig();

  return (
    <ConfigContext.Provider value={data}>
      {isMobile ? (
        <PlaygroundViewProvider>
          <MobilePlayground />
        </PlaygroundViewProvider>
      ) : (
        <SplitPanelsLayoutClient
          component="main"
          TopLeft={ProjectPanel}
          BottomLeft={CodePanel}
          TopRight={TreeViewPanel}
          BottomRight={OutputPanel}
        />
      )}
    </ConfigContext.Provider>
  );
};
