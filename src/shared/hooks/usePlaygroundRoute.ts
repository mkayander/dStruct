"use client";

import {
  useRouter as useAppRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useCallback, useMemo } from "react";

import { usePagesRouterCompat } from "#/shared/hooks/usePagesRouterCompat";
import {
  parsePlaygroundPathname,
  PLAYGROUND_PUBLIC_BASE_PATH,
} from "#/shared/lib/playgroundRoute";

export type PlaygroundNavigateOptions = {
  /** @default false */
  replace?: boolean;
  /** Drop `view` from the next URL. */
  omitView?: boolean;
};

export type PlaygroundRouteContext = {
  basePath: string;
  slug: string[];
  pathname: string;
  navigateTo: (path: string, options?: PlaygroundNavigateOptions) => void;
};

/**
 * Unified playground route state for App Router public paths
 * (`/playground`, `/{lang}/playground`, and legacy pilot bookmarks).
 */
export const usePlaygroundRoute = (): PlaygroundRouteContext | null => {
  const pagesRouter = usePagesRouterCompat();
  const pathname = usePathname();
  const params = useParams();
  const appRouter = useAppRouter();
  const searchParams = useSearchParams();

  const getPagesQuery = useCallback(
    (omitView?: boolean) => {
      if (!pagesRouter) {
        return {};
      }
      const query = { ...pagesRouter.query };
      delete query.slug;
      if (omitView) {
        delete query.view;
      }
      return query;
    },
    [pagesRouter],
  );

  const buildAppQuerySuffix = useCallback(
    (omitView?: boolean) => {
      const nextParams = new URLSearchParams(searchParams?.toString());
      if (omitView) {
        nextParams.delete("view");
      }
      const queryString = nextParams.toString();
      return queryString ? `?${queryString}` : "";
    },
    [searchParams],
  );

  return useMemo(() => {
    if (pagesRouter) {
      const slug = Array.isArray(pagesRouter.query.slug)
        ? pagesRouter.query.slug
        : typeof pagesRouter.query.slug === "string"
          ? [pagesRouter.query.slug]
          : [];

      const navigateTo = (
        targetPath: string,
        options?: PlaygroundNavigateOptions,
      ) => {
        const replace = options?.replace ?? false;
        pagesRouter[replace ? "replace" : "push"](
          {
            pathname: targetPath,
            query: getPagesQuery(options?.omitView),
          },
          undefined,
          { shallow: true },
        );
      };

      return {
        basePath: PLAYGROUND_PUBLIC_BASE_PATH,
        slug,
        pathname:
          pagesRouter.asPath.split("?")[0] ?? PLAYGROUND_PUBLIC_BASE_PATH,
        navigateTo,
      };
    }

    const parsed = pathname ? parsePlaygroundPathname(pathname) : null;
    if (!parsed) {
      return null;
    }

    const slugParam = params?.slug;
    const slug = Array.isArray(slugParam)
      ? slugParam
      : typeof slugParam === "string"
        ? [slugParam]
        : parsed.slug;

    const navigateTo = (
      targetPath: string,
      options?: PlaygroundNavigateOptions,
    ) => {
      const href = `${targetPath}${buildAppQuerySuffix(options?.omitView)}`;
      if (options?.replace) {
        void appRouter.replace(href, { scroll: false });
        return;
      }
      void appRouter.push(href, { scroll: false });
    };

    return {
      basePath: parsed.basePath,
      slug,
      pathname: pathname ?? parsed.basePath,
      navigateTo,
    };
  }, [
    appRouter,
    buildAppQuerySuffix,
    getPagesQuery,
    pagesRouter,
    params?.slug,
    pathname,
  ]);
};
