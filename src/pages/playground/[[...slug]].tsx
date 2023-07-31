import { Container, darken, Stack, useTheme } from "@mui/material";
import type { NextPage } from "next";
import React from "react";

import { MainAppBar, PageScrollContainer } from "#/components";
import { ConfigContext } from "#/context";
import { useAppConfig } from "#/hooks";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import { SplitPanelsLayout } from "#/layouts";
import {
  CodePanel,
  OutputPanel,
  ProjectPanel,
  TreeViewPanel,
} from "#/layouts/panels";
import type { SplitPanelsLayoutProps } from "#/layouts/SplitPanelsLayout/SplitPanelsLayout";

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
      <Container sx={{ pb: 4 }}>
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
