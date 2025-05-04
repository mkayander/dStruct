"use client";

import { useCallback, useState } from "react";

import { useJSCodeRunner } from "./useJSCodeRunner";
import {
  checkPythonRunnerAvailability,
  usePythonCodeRunner,
} from "./usePythonCodeRunner";

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

export const useCodeExecution = (
  codeInput: string,
  language: ProgrammingLanguage,
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { runJSCode, runJSBenchmark } = useJSCodeRunner();
  const { runPythonCode } = usePythonCodeRunner();

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
        if (language === "javascript") {
          await runJSCode(codeInput);
        } else {
          await runPythonCode(codeInput);
        }
      }),
    [codeInput, language, processTask, runJSCode, runPythonCode],
  );

  const runBenchmark = useCallback(
    () =>
      processTask(async () => {
        if (language === "javascript") {
          await runJSBenchmark(codeInput);
        }
      }),
    [codeInput, language, processTask, runJSBenchmark],
  );

  return { isProcessing, error, runCode, runBenchmark };
};
