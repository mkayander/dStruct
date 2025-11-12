import { useEffect, useMemo } from "react";

export const useJSWorker = () => {
  // Create worker using useMemo to avoid recreating on every render
  const worker = useMemo(
    () =>
      new Worker(
        new URL(
          "src/features/codeRunner/lib/workers/codeExec.worker.ts",
          import.meta.url,
        ),
      ),
    [],
  );

  useEffect(() => {
    return () => {
      worker.terminate();
    };
  }, [worker]);

  return { worker };
};
