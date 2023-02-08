import { Container, Stack, type Theme, useMediaQuery } from "@mui/material";
import Head from "next/head";
import React from "react";

import { MainAppBar, PageScrollContainer } from "#/components";
import { SplitPanelsLayout } from "#/layouts";
import type { MainLayoutProps } from "#/layouts/MainLayout";
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
  const isVertical = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("sm")
  );

  if (isVertical)
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
  return (
    <>
      <Head>
        <title>dStruct Playground</title>
      </Head>
      <Wrapper>
        <ProjectPanel />
        <TreeViewPanel />
        <CodePanel />
        <OutputPanel />
      </Wrapper>
    </>
  );
};

const Layout: React.FC<MainLayoutProps> = ({ children, setDarkMode }) => {
  return (
    <PageScrollContainer>
      <MainAppBar setDarkMode={setDarkMode} toolbarVariant="dense" />
      {children}
    </PageScrollContainer>
  );
};

PlaygroundPage.Layout = function PlaygroundLayout({ setDarkMode, children }) {
  return <Layout setDarkMode={setDarkMode}>{children}</Layout>;
};

export default PlaygroundPage;
