import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { useSearchParam } from "#/shared/hooks";
import { PYTHON_SUPPORT_MODAL_ID } from "#/shared/ui/organisms/PythonSupportModal";

import type { ExecutionResult } from "./useCodeExecution";

export const usePythonCodeRunner = () => {
  const [, setModalName] = useSearchParam("modal");

  const openPythonSupportModal = () => {
    setModalName(PYTHON_SUPPORT_MODAL_ID);
  };

  const { mutateAsync: executePythonCode, isLoading } = useMutation({
    mutationFn: async (codeInput: string): Promise<ExecutionResult> => {
      const response = await fetch("http://localhost:8085/python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      openPythonSupportModal();
    },
  });

  const runPythonCode = useCallback(
    async (codeInput: string): Promise<ExecutionResult> => {
      return await executePythonCode(codeInput);
    },
    [executePythonCode],
  );

  return { runPythonCode, isProcessing: isLoading };
};
