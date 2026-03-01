import { darken, useTheme } from "@mui/material";
import type { NextPage } from "next";
import React from "react";

import { ConfigContext } from "#/context";
import { MainAppBar } from "#/features/appBar/ui/MainAppBar";
import { CodePanel } from "#/features/codeRunner/ui/CodePanel";
import { OutputPanel } from "#/features/output/ui/OutputPanel";
import { MobilePlayground } from "#/features/playground/ui/MobilePlayground";
import { ProjectPanel } from "#/features/project/ui/ProjectPanel";
import { TreeViewPanel } from "#/features/treeViewer/ui/TreeViewPanel";
import { useAppConfig, useHasMounted } from "#/shared/hooks";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import { PageScrollContainer } from "#/shared/ui/templates/PageScrollContainer";
import type { SplitPanelsLayoutProps } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout";
import { SplitPanelsLayout } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout";
import { SplitPanelsLayoutSkeleton } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutSkeleton";

type DesktopWrapperProps = SplitPanelsLayoutProps;

const DesktopWrapper: React.FC<DesktopWrapperProps> = ({
  TopLeft,
  BottomLeft,
  TopRight,
  BottomRight,
}) => {
  const hasMounted = useHasMounted();

  // Defer split layout until after mount to avoid Emotion hydration mismatch
  // (server and client can render the four panels in different order).
  if (!hasMounted) return <SplitPanelsLayoutSkeleton />;

  return (
    <SplitPanelsLayout
      component="main"
      TopLeft={TopLeft}
      BottomLeft={BottomLeft}
      TopRight={TopRight}
      BottomRight={BottomRight}
    />
  );
};

const PlaygroundPage: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMobileLayout();

  const { data = {} } = useAppConfig();

  return (
    <ConfigContext.Provider value={data}>
      <PageScrollContainer
        isPage={true}
        options={
          isMobile
            ? { overflow: { x: "hidden", y: "hidden" } }
            : { scrollbars: { autoHide: "scroll" }, overflow: { x: "hidden" } }
        }
        style={{
          height: "100vh",
          background: darken(theme.palette.background.default, 0.1),
        }}
      >
        <MainAppBar toolbarVariant="dense" />
        {isMobile ? (
          <MobilePlayground />
        ) : (
          <DesktopWrapper
            TopLeft={ProjectPanel}
            BottomLeft={CodePanel}
            TopRight={TreeViewPanel}
            BottomRight={OutputPanel}
          />
        )}
      </PageScrollContainer>
    </ConfigContext.Provider>
  );
};

export default PlaygroundPage;
