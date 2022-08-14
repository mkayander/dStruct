import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { withTRPC } from '@trpc/next';
// import { loggerLink } from '@trpc/client/src/links/loggerLink';
// import { httpBatchLink } from '@trpc/client/src/links/httpBatchLink';
import superjson from 'superjson';
import { SessionProvider } from 'next-auth/react';
import type { AppRouter } from '@src/server/routers/app';
import { SSRContext } from '@src/utils/trpc';
import { getBaseUrl } from '@src/utils';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <title>LeetPal - your pal in learning</title>
            </Head>
            <Component {...pageProps} />
        </SessionProvider>
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
