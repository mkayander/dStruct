import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import type { SerializedPythonArg } from "../lib/createPythonRuntimeArgs";
import { pythonRunner } from "../lib/pythonRunner";
import type { ExecutionResult } from "./useCodeExecution";

export const usePythonCodeRunner = () => {
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
