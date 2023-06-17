"use client";

import { useEffect, useMemo, useState } from "react";

type DebounceResult<T> = {
  value: T;
  isPending: boolean;
};

export const useDebounce = <T>(value: T, delay: number): DebounceResult<T> => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
      setIsPending(false);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return useMemo(
    () => ({ value: debouncedValue, isPending }),
    [debouncedValue, isPending]
  );
};
