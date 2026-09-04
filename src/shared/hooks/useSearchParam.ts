"use client";

import {
  useRouter as useAppRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { startTransition, useCallback, useEffect, useState } from "react";

export type SearchParamOptions<T extends string = string> = {
  defaultValue: T;
  validate: (value: unknown) => value is T;
};

export type SearchParamUpdateOptions = {
  replace?: boolean;
  pathName?: string;
};

/**
 * React hook to read and update a single search param via App Router.
 *
 * @param param The search param to read and update.
 * @param options Options to customize the behavior of the hook.
 * @returns A tuple with the current value of the search param and a function to update it.
 */
export const useSearchParam = <T extends string = string>(
  param: string,
  options: SearchParamOptions<T> = {
    defaultValue: "" as T,
    validate: (value): value is T => typeof value === "string",
  },
) => {
  const { defaultValue, validate } = options;
  const pathname = usePathname();
  const appRouter = useAppRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<T | "">(() => {
    const initialValue = searchParams?.get(param) ?? undefined;
    if (validate(initialValue)) {
      return initialValue;
    }

    return defaultValue;
  });

  useEffect(() => {
    const paramValue = searchParams?.get(param) ?? undefined;
    startTransition(() => {
      if (validate(paramValue)) {
        setState(paramValue);
        return;
      }
      setState(defaultValue);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- URL is source of truth; options are stable for a given hook call site
  }, [param, searchParams]);

  const updateParam = useCallback(
    (value: string, options: SearchParamUpdateOptions = {}) => {
      if (value !== "" && !validate(value)) return;

      setState(value);

      if (!pathname) {
        return;
      }

      const nextParams = new URLSearchParams(searchParams?.toString());
      if (value === "") {
        nextParams.delete(param);
      } else {
        nextParams.set(param, value);
      }
      const queryString = nextParams.toString();
      const targetPath = options.pathName ?? pathname;
      const href = queryString ? `${targetPath}?${queryString}` : targetPath;
      if (options.replace) {
        void appRouter.replace(href, { scroll: false });
      } else {
        void appRouter.push(href, { scroll: false });
      }
    },
    [appRouter, param, pathname, searchParams, validate],
  );

  return [state, updateParam] as const;
};
