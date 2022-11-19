import { QueryClient as ReactQueryClient } from '@tanstack/react-query';

export const reactQueryClient = new ReactQueryClient({
    defaultOptions: {
        queries: { suspense: true },
    },
});
