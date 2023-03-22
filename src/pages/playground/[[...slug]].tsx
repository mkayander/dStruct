import { Container, darken, Stack, useTheme } from "@mui/material";
import Head from "next/head";
import React from "react";

import { MainAppBar, PageScrollContainer } from "#/components";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import { SplitPanelsLayout } from "#/layouts";
import {
  CodePanel,
  OutputPanel,
  ProjectPanel,
  TreeViewPanel,
} from "#/layouts/panels";
import type { SplitPanelsLayoutProps } from "#/layouts/SplitPanelsLayout/SplitPanelsLayout";
import type { NextPageWithLayout } from "#/types/page";

type WrapperProps = SplitPanelsLayoutProps;

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const isMobile = useMobileLayout();

  if (isMobile)
    return (
      <Container sx={{ pb: 4 }}>
        <Stack spacing={1} mt={1} pb={4}>
          {children}
        </Stack>
      </Container>
    );

  return <SplitPanelsLayout>{children}</SplitPanelsLayout>;
};

const PlaygroundPage: NextPageWithLayout = () => {
  const theme = useTheme();
  return (
    <PageScrollContainer
      isPage={true}
      style={{
        height: "100vh",
        background: darken(theme.palette.background.default, 0.1),
      }}
    >
      <Head>
        <title>dStruct Playground</title>
      </Head>
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <MainAppBar toolbarVariant="dense" />
      <Wrapper>
        <ProjectPanel />
        <TreeViewPanel />
        <CodePanel />
        <OutputPanel />
      </Wrapper>
    </PageScrollContainer>
  );
};

export default PlaygroundPage;
