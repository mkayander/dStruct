import { useEffect, useState } from "react";

export const useJSWorker = () => {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL(
        "src/features/codeRunner/lib/workers/codeExec.worker.ts",
        import.meta.url,
      ),
    );
    setWorker(worker);

    return () => {
      worker.terminate();
    };
  }, []);

  return { worker };
};
