import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { useAppDispatch } from "#/store/hooks";

import type { SerializedPythonArg } from "../lib/createPythonRuntimeArgs";
import { pythonRunner } from "../lib/pythonRunner";
import { pyodideSlice } from "../model/pyodideSlice";
import type { ExecutionResult } from "./useCodeExecution";
import { usePyodideProgressSnackbar } from "./usePyodideProgressSnackbar";

/** Delay after 100% so the progress bar animation completes before snackbar closes. */
const PROGRESS_COMPLETE_DELAY_MS = 400;

export const usePythonCodeRunner = () => {
  const dispatch = useAppDispatch();

  usePyodideProgressSnackbar();

  // Preload Pyodide worker when the hook mounts (user entered Python page).
  // Progress is dispatched to Redux; usePyodideProgressSnackbar shows the snackbar.
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

  const { mutateAsync: executePythonCode, isPending } = useMutation({
    mutationFn: async ({
      codeInput,
      args,
    }: {
      codeInput: string;
      args?: SerializedPythonArg[];
    }): Promise<ExecutionResult> => {
      return pythonRunner.run(codeInput, undefined, args);
    },
  });

  const runPythonCode = useCallback(
    async (
      codeInput: string,
      args?: SerializedPythonArg[],
    ): Promise<ExecutionResult> => {
      return await executePythonCode({ codeInput, args });
    },
    [executePythonCode],
  );

  return { runPythonCode, isProcessing: isPending };
};
