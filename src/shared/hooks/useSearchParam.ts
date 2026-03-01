import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export type SearchParamOptions<T extends string = string> = {
  defaultValue: T;
  validate: (value: unknown) => value is T;
};

export type SearchParamUpdateOptions = {
  replace?: boolean;
  pathName?: string;
};

/**
 * Get param value from router.query for SSR-safe initial state.
 * Avoids window.location which causes hydration mismatch (undefined on server).
 */
const getParamFromRouter = (
  param: string,
  query: Record<string, string | string[] | undefined>,
) => {
  const paramValue = query[param];
  return Array.isArray(paramValue) ? paramValue[0] : paramValue;
};

/**
 * React hook to read and update a single search param.
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
  const router = useRouter();
  const [state, setState] = useState<T | "">(() => {
    const initialValue = getParamFromRouter(param, router.query);
    if (validate(initialValue)) {
      return initialValue;
    }

    return defaultValue;
  });

  useEffect(() => {
    const { query } = router;
    const paramValue = query[param];
    if (Array.isArray(paramValue)) {
      console.error(
        `useSearchParam: param ${param} is an array. This is not supported.`,
      );
      return;
    }

    if (validate(paramValue)) {
      setState(paramValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, param]);

  const updateParam = useCallback(
    (value: T | "", options: SearchParamUpdateOptions = {}) => {
      if (value !== "" && !validate(value)) return;

      setState(value);
      const { pathname, query } = router;
      const newQuery = { ...query };
      if (value === "") {
        delete newQuery[param];
      } else {
        newQuery[param] = value;
      }
      void router[options.replace ? "replace" : "push"](
        { pathname: options.pathName ?? pathname, query: newQuery },
        undefined,
        {
          shallow: true,
        },
      );
    },
    [validate, router, param],
  );

  return [state, updateParam] as const;
};
