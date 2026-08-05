"use client";

import { usePathname as useAppPathname } from "next/navigation";

import { usePagesRouterCompat } from "#/shared/hooks/usePagesRouterCompat";

/**
 * Current pathname for shared UI that runs under Pages or App Router.
 * Prefer Pages `pathname` when available (locale-aware route file path);
 * otherwise App Router `usePathname()`.
 */
export const useRoutePathname = (): string => {
  const pagesRouter = usePagesRouterCompat();
  const appPathname = useAppPathname();

  if (pagesRouter) {
    return pagesRouter.pathname;
  }

  return appPathname ?? "/";
};
