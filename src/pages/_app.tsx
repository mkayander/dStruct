import React, { useMemo } from 'react';
import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { withTRPC } from '@trpc/next';
// import { loggerLink } from '@trpc/client/src/links/loggerLink';
// import { httpBatchLink } from '@trpc/client/src/links/httpBatchLink';
import superjson from 'superjson';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import type { AppRouter } from '@src/server/routers/app';
import { SSRContext } from '@src/utils/trpc';
import { getBaseUrl } from '@src/utils';
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

export default withTRPC<AppRouter>({
    config() {
        return {
            url: `${getBaseUrl()}/api/trpc`,
            /**
             * @link https://trpc.io/docs/links
             */
            // links: [
            //     // adds pretty logs to your console in development and logs errors in production
            //     loggerLink({
            //         enabled: (opts) =>
            //             process.env.NODE_ENV === 'development' ||
            //             (opts.direction === 'down' && opts.result instanceof Error),
            //     }),
            //     httpBatchLink({
            //         url: `${getBaseUrl()}/api/trpc`,
            //     }),
            // ],
            /**
             * @link https://trpc.io/docs/data-transformers
             */
            transformer: superjson,
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: true,
    /**
     * Set headers or status code when doing SSR
     */
    responseMeta(opts) {
        const ctx = opts.ctx as SSRContext;

        if (ctx.status) {
            // If HTTP status set, propagate that
            return {
                status: ctx.status,
            };
        }

        const error = opts.clientErrors[0];
        if (error) {
            // Propagate http first error from API calls
            return {
                status: error.data?.httpStatus ?? 500,
            };
        }
        // For app caching with SSR see https://trpc.io/docs/caching
        return {};
    },
})(MyApp);
