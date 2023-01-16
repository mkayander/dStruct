import { Box } from '@mui/material';
import Head from 'next/head';
import React, { useState } from 'react';

import { MainAppBar } from '#/components';
import { useBinaryTree } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';
import { SplitPanelsLayout } from '#/layouts';
import type { MainLayoutProps } from '#/layouts/MainLayout';
import {
  CodePanel,
  OutputPanel,
  SettingsPanel,
  TreeViewPanel,
} from '#/layouts/panels';
import type { NextPageWithLayout } from '#/types/page';

const PlaygroundPage: NextPageWithLayout = () => {
  const [parsedInput, setParsedInput] = useState<BinaryTreeInput | undefined>();

  const tree = useBinaryTree(parsedInput);

  return (
    <>
      <Head>
        <title>LeetPal Playground</title>
      </Head>
      <SplitPanelsLayout>
        <SettingsPanel setParsedInput={setParsedInput} />
        <TreeViewPanel tree={tree} />
        <CodePanel tree={tree} />
        <OutputPanel />
      </SplitPanelsLayout>
    </>
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
