import { Box } from '@mui/material';
import Head from 'next/head';
import React, { useMemo } from 'react';

import { MainAppBar } from '#/components';
import { PlaygroundRuntimeContext } from '#/context';
import { useRuntimeBinaryTree } from '#/hooks';
import { SplitPanelsLayout } from '#/layouts';
import type { MainLayoutProps } from '#/layouts/MainLayout';
import {
  CodePanel,
  OutputPanel,
  ProjectPanel,
  TreeViewPanel,
} from '#/layouts/panels';
import type { NextPageWithLayout } from '#/types/page';

const PlaygroundPage: NextPageWithLayout = () => {
  const tree = useRuntimeBinaryTree();

  const runtimeContext = useMemo(
    () => ({
      tree,
    }),
    [tree]
  );

  return (
    <PlaygroundRuntimeContext.Provider value={runtimeContext}>
      <Head>
        <title>dStruct Playground</title>
      </Head>
      <SplitPanelsLayout>
        <ProjectPanel />
        <TreeViewPanel />
        <CodePanel />
        <OutputPanel />
      </SplitPanelsLayout>
    </PlaygroundRuntimeContext.Provider>
  );
};

const Layout: React.FC<MainLayoutProps> = ({ children, setDarkMode }) => (
  <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
    <MainAppBar
      setDarkMode={setDarkMode}
      // appBarVariant="outlined"
      toolbarVariant="dense"
    />
    {children}
  </Box>
);

PlaygroundPage.Layout = function PlaygroundLayout({ setDarkMode, children }) {
  return <Layout setDarkMode={setDarkMode}>{children}</Layout>;
};

export default PlaygroundPage;
