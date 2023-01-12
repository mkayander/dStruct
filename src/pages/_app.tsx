import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { type ReactElement, useMemo, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { apolloClient } from '#/graphql/apolloClient';
import { MainLayout as DefaultLayout } from '#/layouts/MainLayout';
import { themes } from '#/themes';
import type { AppTypeWithLayout, GetLayout } from '#/types/page';
import { trpc } from '#/utils';

import { wrapper } from '#/store/makeStore';
import '#/styles/globals.css';

import 'overlayscrollbars/overlayscrollbars.css';

const MyApp: AppTypeWithLayout<{ session: Session | null }> = ({
  Component,
  ...restProps
}) => {
  const { store, props } = wrapper.useWrappedStore(restProps);
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [darkMode, setDarkMode] = useState(true);

  const theme = useMemo(
    () => (darkMode ? themes.dark : themes.light),
    [darkMode]
  );

  const getLayout: GetLayout =
    Component.getLayout ??
    ((page: ReactElement, setDarkMode) => (
      <DefaultLayout setDarkMode={setDarkMode}>{page}</DefaultLayout>
    ));

  return (
    <ReduxProvider store={store}>
      <SessionProvider session={restProps.pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <Head>
              <title>LeetPal</title>
            </Head>
            <CssBaseline />
            {getLayout(<Component {...props.pageProps} />, setDarkMode)}
          </ThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default trpc.withTRPC(MyApp);
