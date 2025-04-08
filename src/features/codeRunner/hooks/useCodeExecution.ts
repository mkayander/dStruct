"use client";

import { useCallback, useState } from "react";

import { useJSCodeRunner } from "./useJSCodeRunner";

export type ProgrammingLanguage = "javascript" | "python";

export const isLanguageValid = (value: unknown): value is ProgrammingLanguage =>
  ["javascript", "python"].includes(String(value));

export const getCodeKey = (language: ProgrammingLanguage | "") => {
  switch (language) {
    default:
    case "javascript":
      return "code";
    case "python":
      return "pythonCode";
  }
};

export const useCodeExecution = (codeInput: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { runJSCode, runJSBenchmark } = useJSCodeRunner();

  const processTask = useCallback(async (task: () => Promise<void>) => {
    setIsProcessing(true);
    try {
      await task();
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const runCode = useCallback(
    () =>
      processTask(async () => {
        await runJSCode(codeInput);
      }),
    [codeInput, processTask, runJSCode],
  );

  const runBenchmark = useCallback(
    () =>
      processTask(async () => {
        await runJSBenchmark(codeInput);
      }),
    [codeInput, processTask, runJSBenchmark],
  );

  return { isProcessing, error, runCode, runBenchmark };
};
