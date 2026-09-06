import { useEffect } from "react";

import { usePyodideProgressSnackbar } from "#/features/codeRunner/hooks/usePyodideProgressSnackbar";
import { pythonRunner } from "#/features/codeRunner/lib/pythonRunner";
import { pyodideSlice } from "#/features/codeRunner/model/pyodideSlice";
import { useAppDispatch } from "#/store/hooks";

/** Delay after 100% so the progress bar animation completes before snackbar closes. */
const PROGRESS_COMPLETE_DELAY_MS = 400;

/**
 * Warm Pyodide once per playground segment visit.
 * Lives in playground layout so loading → page transitions do not restart init.
 */
export const usePlaygroundPyodideWarmup = (): void => {
  const dispatch = useAppDispatch();

  usePyodideProgressSnackbar();

  useEffect(() => {
    if (pythonRunner.isReady) return;

    let cancelled = false;

    dispatch(
      pyodideSlice.actions.setProgress({ value: 0, stage: "Starting…" }),
    );

    let completeTimeoutId: ReturnType<typeof setTimeout> | null = null;

    pythonRunner
      .init({
        onProgress: (value, stage) => {
          if (!cancelled) {
            dispatch(pyodideSlice.actions.setProgress({ value, stage }));
          }
        },
      })
      .catch(() => undefined)
      .finally(() => {
        if (cancelled) return;

        completeTimeoutId = setTimeout(() => {
          completeTimeoutId = null;
          if (!cancelled) {
            dispatch(pyodideSlice.actions.clearProgress());
          }
        }, PROGRESS_COMPLETE_DELAY_MS);
      });

    return () => {
      cancelled = true;
      if (completeTimeoutId !== null) {
        clearTimeout(completeTimeoutId);
      }
      dispatch(pyodideSlice.actions.clearProgress());
    };
  }, [dispatch]);
};
