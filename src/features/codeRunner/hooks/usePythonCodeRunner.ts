import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { useSearchParam } from "#/shared/hooks";
import { PYTHON_SUPPORT_MODAL_ID } from "#/shared/ui/organisms/PythonSupportModal";

import { pythonRunner } from "../lib/pythonRunner";
import type { ExecutionResult } from "./useCodeExecution";

const PYTHON_EXEC_MODE = process.env.NEXT_PUBLIC_PYTHON_EXEC_MODE ?? "pyodide";

export const usePythonCodeRunner = () => {
  const [, setModalName] = useSearchParam("modal");

  const openPythonSupportModal = () => {
    setModalName(PYTHON_SUPPORT_MODAL_ID);
  };

  // Preload Pyodide worker when the hook mounts (user entered Python page)
  useEffect(() => {
    if (PYTHON_EXEC_MODE !== "pyodide") return;
    pythonRunner.init().catch((err: unknown) => {
      console.warn("Pyodide preload failed, will retry on run:", err);
    });
  }, []);

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
