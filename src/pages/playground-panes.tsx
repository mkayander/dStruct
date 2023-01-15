import { Box } from '@mui/material';
import Head from 'next/head';
import React, { type PropsWithChildren, useState } from 'react';

import { MainAppBar } from '#/components';
import { useBinaryTree } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';
import { SplitPanelsLayout } from '#/layouts';
import {
  CodePanel,
  OutputPanel,
  SettingsPanel,
  TreeViewPanel,
} from '#/layouts/panels';
import type { GetLayout, NextPageWithLayout } from '#/types/page';

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

const Layout: React.FC<
  PropsWithChildren<{ setDarkMode: Parameters<GetLayout>[1] }>
> = ({ children, setDarkMode }) => (
  <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
    <MainAppBar
      setDarkMode={setDarkMode}
      appBarVariant="outlined"
      toolbarVariant="dense"
    />
    {/*{isLoading ? <LinearProgress variant='indeterminate' /> : children}*/}
    {children}
    {/*<Footer />*/}
  </Box>
);

PlaygroundPage.getLayout = (page, setDarkMode) => (
  <Layout setDarkMode={setDarkMode}>{page}</Layout>
);

export default PlaygroundPage;
