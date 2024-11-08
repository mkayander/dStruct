import { Container, darken, Stack, useTheme } from "@mui/material";
import type { NextPage } from "next";
import React from "react";

import {
  CodePanel,
  OutputPanel,
  ProjectPanel,
  TreeViewPanel,
} from "#/components/organisms/panels";
import { PageScrollContainer } from "#/components/templates/PageScrollContainer";
import type { SplitPanelsLayoutProps } from "#/components/templates/SplitPanelsLayout/SplitPanelsLayout";
import { SplitPanelsLayout } from "#/components/templates/SplitPanelsLayout/SplitPanelsLayout";
import { ConfigContext } from "#/context";
import { MainAppBar } from "#/features/appBar/ui/MainAppBar";
import { useAppConfig } from "#/hooks";
import { useMobileLayout } from "#/hooks/useMobileLayout";

type WrapperProps = SplitPanelsLayoutProps;

const Wrapper: React.FC<WrapperProps> = ({
  TopLeft,
  BottomLeft,
  TopRight,
  BottomRight,
}) => {
  const isMobile = useMobileLayout();

  if (isMobile)
    return (
      <Container component="main" sx={{ pb: 4 }}>
        <Stack spacing={1} mt={1} pb={4}>
          <TopLeft />
          <TopRight />
          <BottomLeft />
          <BottomRight />
        </Stack>
      </Container>
    );

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

  const { data = {} } = useAppConfig();

  return (
    <ConfigContext.Provider value={data}>
      <PageScrollContainer
        isPage={true}
        style={{
          height: "100vh",
          background: darken(theme.palette.background.default, 0.1),
        }}
      >
        <MainAppBar toolbarVariant="dense" />
        <Wrapper
          TopLeft={ProjectPanel}
          BottomLeft={CodePanel}
          TopRight={TreeViewPanel}
          BottomRight={OutputPanel}
        />
      </PageScrollContainer>
    </ConfigContext.Provider>
  );
};

export default PlaygroundPage;
