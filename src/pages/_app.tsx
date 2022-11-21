import React, { useMemo } from 'react';
import type { AppType } from 'next/app';
import Head from 'next/head';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
// import { QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import { trpc } from '#/utils';
import { ThemeProvider } from '@mui/material/styles';
import theme from '#/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { apolloClient } from '#/graphql/apolloClient';
import { GlobalContext } from '#/context';
import { GlobalContextType } from '#/context/GlobalContext';
// import { reactQueryClient } from '#/utils/reactQueryClient';

import '../styles/globals.css';

interface MyAppProps {
    session: Session | null;
}

const MyApp: AppType<MyAppProps> = ({ Component, pageProps }) => {
    const globalContext = useMemo<GlobalContextType>(() => ({}), []);

    return (
        <GlobalContext.Provider value={globalContext}>
            <SessionProvider session={pageProps.session}>
                <ApolloProvider client={apolloClient}>
                    {/*<QueryClientProvider client={reactQueryClient}>*/}
                    <ThemeProvider theme={theme}>
                        <Head>
                            <title>LeetPal - your pal in learning</title>
                            {/* PWA primary color */}
                            <meta name="theme-color" content={theme.palette.primary.main} />
                            <meta name="viewport" content="initial-scale=1, width=device-width" />
                        </Head>
                        <CssBaseline />
                        <Component {...pageProps} />
                    </ThemeProvider>
                    {/*</QueryClientProvider>*/}
                </ApolloProvider>
            </SessionProvider>
        </GlobalContext.Provider>
    );
};

export default trpc.withTRPC(MyApp);
