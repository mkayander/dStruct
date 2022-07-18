import { createReactQueryHooks } from '@trpc/react';
import { inferProcedureOutput } from '@trpc/server';
// import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import { NextPageContext } from 'next';
// ℹ️ Type-only import:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
import type { AppRouter } from '@src/server/routers/app';

/**
 * Extend `NextPageContext` with metadata that can be picked up by `responseMeta()` when server-side rendering
 */
export interface SSRContext extends NextPageContext {
    /**
     * Set HTTP Status code
     * @usage
     * const utils = trpc.useContext();
     * if (utils.ssrContext) {
     *   utils.ssrContext.status = 404;
     * }
     */
    status?: number;
}

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createReactQueryHooks<AppRouter, SSRContext>();

export type inferQueryResponse<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureOutput<
    AppRouter['_def']['queries'][TRouteKey]
>;
