import { useMutation } from "@tanstack/react-query";

import { javascriptFormatRunner } from "#/features/codeRunner/lib/javascriptFormatRunner";

/**
 * Client-side JS formatting via Prettier in a Web Worker (symmetric with Python/Black).
 */
export const useJavaScriptFormatCode = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { formatted, error } =
        await javascriptFormatRunner.formatCode(code);
      if (error !== null) {
        throw new Error(error);
      }
      return formatted;
    },
  });
};
