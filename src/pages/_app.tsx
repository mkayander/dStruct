import { ApolloProvider } from '@apollo/client';
import { Box, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { type ReactElement, useMemo, useState } from 'react';

import { apolloClient } from '#/graphql/apolloClient';
import { MainLayout as DefaultLayout } from '#/layouts/MainLayout';
import { themes } from '#/themes';
import type { AppTypeWithLayout } from '#/types/page';
import { trpc } from '#/utils';

import '#/styles/globals.css';

import 'overlayscrollbars/overlayscrollbars.css';

const MyApp: AppTypeWithLayout<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [darkMode, setDarkMode] = useState(true);

  const theme = useMemo(
    () => (darkMode ? themes.dark : themes.light),
    [darkMode]
  );

  const getLayout =
    Component.getLayout ??
    ((page: ReactElement) => (
      <DefaultLayout setDarkMode={setDarkMode}>{page}</DefaultLayout>
    ));

  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <Head>
            <title>LeetPal</title>
          </Head>
          <CssBaseline />
          <Box
            sx={{
              '.os-theme-dark.os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle':
                {
                  background: theme.palette.action.hover,
                },
            }}
          >
            <OverlayScrollbarsComponent
              defer
              style={{ height: '100vh' }}
              options={{
                scrollbars: {
                  autoHide: 'scroll',
                },
              }}
            >
              {getLayout(<Component {...pageProps} />)}
            </OverlayScrollbarsComponent>
          </Box>
        </ThemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
