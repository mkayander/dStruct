import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { apolloClient } from '#/graphql/apolloClient';
import { trpc } from '#/utils';
import theme from '#/theme';

import '#/styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = (
    {
        Component,
        pageProps: { session, ...pageProps }
    }) => {
    return (
        <SessionProvider session={session}>
            <ApolloProvider client={apolloClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </ApolloProvider>
        </SessionProvider>
    );
};

export default trpc.withTRPC(MyApp);
