import type { ReactElement } from 'react';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { apolloClient } from '#/graphql/apolloClient';
import type { AppTypeWithLayout } from '#/types/page';
import { MainLayout as DefaultLayout } from '#/layouts/MainLayout';
import { trpc } from '#/utils';
import theme from '#/theme';

import '#/styles/globals.css';

const MyApp: AppTypeWithLayout<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout =
    Component.getLayout ??
    ((page: ReactElement) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
