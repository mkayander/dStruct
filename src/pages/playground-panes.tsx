import { Box } from '@mui/material';
import Head from 'next/head';
import React, { type PropsWithChildren } from 'react';

import { MainAppBar } from '#/components';
import { SplitPanelsLayout } from '#/layouts';
import type { GetLayout, NextPageWithLayout } from '#/types/page';

const PlaygroundPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>LeetPal Playground</title>
      </Head>
      <SplitPanelsLayout>
        <Box sx={{ p: 1, backgroundColor: 'primary.main' }}>Top Left</Box>
        <Box sx={{ p: 1, backgroundColor: 'secondary.main' }}>Top Right</Box>
        <Box sx={{ p: 1, backgroundColor: 'warning.light' }}>Bottom Left</Box>
        <Box sx={{ p: 1, backgroundColor: 'info.main' }}>Bottom Right</Box>
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
