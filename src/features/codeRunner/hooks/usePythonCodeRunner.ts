import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { useSearchParam } from "#/shared/hooks";
import { PYTHON_SUPPORT_MODAL_ID } from "#/shared/ui/organisms/PythonSupportModal";

interface ExecutionResult {
  success: boolean;
  callstack?: any[];
  error?: string;
}

export const usePythonCodeRunner = () => {
  const [, setModalName] = useSearchParam("modal");

  const openPythonSupportModal = () => {
    setModalName(PYTHON_SUPPORT_MODAL_ID);
  };

  const { mutateAsync: executePythonCode, isLoading } = useMutation({
    mutationFn: async (codeInput: string) => {
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

      const result = (await response.json()) as ExecutionResult;
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: () => {
      openPythonSupportModal();
    },
  });

  const runPythonCode = useCallback(
    async (codeInput: string) => {
      return await executePythonCode(codeInput);
    },
    [executePythonCode],
  );

  return { runPythonCode, isProcessing: isLoading };
};
