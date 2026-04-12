"use client";

/**
 * Regression: TanStack Query `useMutation()` returns a new result object every render.
 * Putting that object in `useCallback` / `useEffect` dependency arrays re-runs effects
 * every render — if the effect dispatches to Redux (see CodePanel solution sync +
 * `loadFinish`), React hits "Maximum update depth exceeded".
 *
 * Pattern: keep the latest mutation in a ref and use `useCallback(..., [])` for cancel
 * helpers that call `mutation.reset()` / `mutateAsync`.
 */
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { afterEach, describe, expect, it } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: false } },
});

afterEach(() => {
  queryClient.clear();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useMutation + useCallback + useEffect (CodePanel regression)", () => {
  it("unstable mutation in useCallback deps re-runs an effect on every parent render", async () => {
    let effectRunCount = 0;

    const UnstableCancel: React.FC = () => {
      const mutation = useMutation({
        mutationFn: async (value: string) => value,
      });
      const cancel = useCallback(() => {
        mutation.reset();
      }, [mutation]);
      const [tick, setTick] = useState(0);

      useEffect(() => {
        effectRunCount += 1;
      }, [cancel]);

      return (
        <button
          type="button"
          onClick={() => setTick((value) => value + 1)}
        >{`tick-${tick}`}</button>
      );
    };

    effectRunCount = 0;
    render(<UnstableCancel />, { wrapper });

    expect(effectRunCount).toBe(1);

    await userEvent.click(screen.getByRole("button"));

    expect(effectRunCount).toBeGreaterThanOrEqual(2);
  });

  it("ref-based cancel keeps effect from re-running when only the mutation identity changes", async () => {
    let effectRunCount = 0;

    const StableCancel: React.FC = () => {
      const mutation = useMutation({
        mutationFn: async (value: string) => value,
      });
      const mutationRef = useRef(mutation);
      mutationRef.current = mutation;
      const cancel = useCallback(() => {
        mutationRef.current.reset();
      }, []);
      const [tick, setTick] = useState(0);

      useEffect(() => {
        effectRunCount += 1;
      }, [cancel]);

      return (
        <button
          type="button"
          onClick={() => setTick((value) => value + 1)}
        >{`tick-${tick}`}</button>
      );
    };

    effectRunCount = 0;
    render(<StableCancel />, { wrapper });

    expect(effectRunCount).toBe(1);

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button"));

    expect(effectRunCount).toBe(1);
  });
});
