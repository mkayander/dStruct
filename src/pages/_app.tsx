import React, { useMemo } from 'react';
import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import { trpc } from '@src/utils';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@src/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { client } from '@src/graphql/client';
import { GlobalContext } from '@src/context';
import { GlobalContextType } from '@src/context/GlobalContext';

const queryClient = new QueryClient();

interface MyAppProps {
    session: Session;
}

const MyApp = ({ Component, pageProps }: AppProps<MyAppProps>) => {
    const globalContext = useMemo<GlobalContextType>(() => ({}), []);

    return (
        <GlobalContext.Provider value={globalContext}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
                <ApolloProvider client={client}>
                    <QueryClientProvider client={queryClient}>
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
                    </QueryClientProvider>
                </ApolloProvider>
            </SessionProvider>
        </GlobalContext.Provider>
    );
};

export default trpc.withTRPC(MyApp);
