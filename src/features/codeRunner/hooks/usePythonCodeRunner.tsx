import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { useSearchParam } from "#/shared/hooks";
import { PYTHON_SUPPORT_MODAL_ID } from "#/shared/ui/organisms/PythonSupportModal";
import { useAppDispatch } from "#/store/hooks";

import { pythonRunner } from "../lib/pythonRunner";
import { pyodideSlice } from "../model/pyodideSlice";
import type { ExecutionResult } from "./useCodeExecution";

const PYTHON_EXEC_MODE = process.env.NEXT_PUBLIC_PYTHON_EXEC_MODE ?? "pyodide";

/** Delay after 100% so the progress bar animation completes before snackbar closes. */
const PROGRESS_COMPLETE_DELAY_MS = 400;

export const usePythonCodeRunner = () => {
  const dispatch = useAppDispatch();
  const [, setModalName] = useSearchParam("modal");

  const openPythonSupportModal = () => {
    setModalName(PYTHON_SUPPORT_MODAL_ID);
  };

  // Preload Pyodide worker when the hook mounts (user entered Python page).
  // Progress is dispatched to Redux; usePyodideProgressSnackbar shows the snackbar.
  useEffect(() => {
    if (PYTHON_EXEC_MODE !== "pyodide") return;
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
    mutationFn: async (codeInput: string): Promise<ExecutionResult> => {
      if (PYTHON_EXEC_MODE === "pyodide") {
        return pythonRunner.run(codeInput);
      }

      // Legacy server mode
      const response = await fetch("http://localhost:8085/python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result) {
        throw new Error("No result returned from Python execution");
      }

      return result as ExecutionResult;
    },
    onError: () => {
      if (PYTHON_EXEC_MODE !== "pyodide") {
        openPythonSupportModal();
      }
    },
  });

  const runPythonCode = useCallback(
    async (codeInput: string): Promise<ExecutionResult> => {
      return await executePythonCode(codeInput);
    },
    [executePythonCode],
  );

  return { runPythonCode, isProcessing: isPending };
};
