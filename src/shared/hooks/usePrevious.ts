"use client";

import { useEffect, useRef } from "react";

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // eslint-disable-next-line -- usePrevious hook intentionally accesses ref during render
  return ref.current;
};
