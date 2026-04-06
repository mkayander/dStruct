import { useMutation } from "@tanstack/react-query";

import { pythonRunner } from "#/features/codeRunner/lib/pythonRunner";

/**
 * Client-side Python formatting via Pyodide + Black (same worker as code execution).
 */
export const usePythonFormatCode = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { formatted, error } = await pythonRunner.formatCode(code);
      if (error !== null) {
        throw new Error(error);
      }
      return formatted;
    },
  });
};
