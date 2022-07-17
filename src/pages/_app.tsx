import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
// import { loggerLink } from '@trpc/client/src/links/loggerLink';
// import { httpBatchLink } from '@trpc/client/src/links/httpBatchLink';
import superjson from 'superjson';
import type { AppRouter } from '@src/server/routers/app';
import { SSRContext } from '@src/utils/trpc';

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return '';
    }

    // reference for vercel.com
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // // reference for render.com
    if (process.env.RENDER_INTERNAL_HOSTNAME) {
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
    }

    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`;
};

const MyApp = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
    config() {
        return {
            url: getBaseUrl(),
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
