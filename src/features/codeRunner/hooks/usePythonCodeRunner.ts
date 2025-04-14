import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

interface ExecutionResult {
  success: boolean;
  callstack?: any[];
  error?: string;
}

export const usePythonCodeRunner = () => {
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
  });

  const runPythonCode = useCallback(
    async (codeInput: string) => {
      return await executePythonCode(codeInput);
    },
    [executePythonCode],
  );

  return { runPythonCode, isProcessing: isLoading };
};
