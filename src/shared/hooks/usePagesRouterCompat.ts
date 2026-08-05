"use client";

/**
 * Pages Router instance when mounted; `null` under the App Router.
 * Prefer this over `next/router` in shared UI used by both routers.
 *
 * @see https://nextjs.org/docs/pages/api-reference/functions/use-router#the-nextcompatrouter-export
 */
export { useRouter as usePagesRouterCompat } from "next/compat/router";
