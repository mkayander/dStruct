"use client";

import {
  useRouter as useAppRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useCallback, useMemo } from "react";

import { parsePlaygroundPathname } from "#/shared/lib/playgroundRoute";

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
 * Playground route state for App Router public paths
 * (`/playground`, `/{lang}/playground`, and legacy pilot bookmarks).
 */
export const usePlaygroundRoute = (): PlaygroundRouteContext | null => {
  const pathname = usePathname();
  const params = useParams();
  const appRouter = useAppRouter();
  const searchParams = useSearchParams();

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
  }, [appRouter, buildAppQuerySuffix, params?.slug, pathname]);
};
