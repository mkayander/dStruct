import { generate } from "short-uuid";

import type {
  PrettierWorkerInMessage,
  PrettierWorkerOutMessage,
} from "./workers/prettierFormat.worker.types";

const DEFAULT_FORMAT_TIMEOUT_MS = 30_000;

export type JavaScriptFormatResult = {
  formatted: string;
  error: string | null;
};

function createDefaultWorker(): Worker {
  return new Worker(
    new URL(
      "src/features/codeRunner/lib/workers/prettierFormat.worker.ts",
      import.meta.url,
    ),
  );
}

/**
 * Formats JavaScript/TS-like playground code with Prettier in a dedicated Web Worker
 * (symmetric with Pyodide-based Python formatting).
 */
class JavaScriptFormatRunner {
  private worker: Worker | null = null;
  private operationGate: Promise<void> = Promise.resolve();
  private readonly createWorkerInstance: () => Worker;

  constructor(createWorkerInstance: () => Worker = createDefaultWorker) {
    this.createWorkerInstance = createWorkerInstance;
  }

  private async withSerializedOperation<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    await this.operationGate;
    let releaseGate!: () => void;
    this.operationGate = new Promise<void>((resolveGate) => {
      releaseGate = resolveGate;
    });
    try {
      return await operation();
    } finally {
      releaseGate();
    }
  }

  async formatCode(
    code: string,
    timeoutMs: number = DEFAULT_FORMAT_TIMEOUT_MS,
  ): Promise<JavaScriptFormatResult> {
    return this.withSerializedOperation(async () => {
      if (!this.worker) {
        this.worker = this.createWorkerInstance();
      }

      const worker = this.worker;
      const requestId = generate();

      return await new Promise<JavaScriptFormatResult>((resolve) => {
        let settled = false;
        let timer: ReturnType<typeof setTimeout> | null = null;

        const settle = () => {
          settled = true;
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          worker.removeEventListener("message", onMessage);
          worker.removeEventListener("error", onError);
        };

        const onMessage = (event: MessageEvent<PrettierWorkerOutMessage>) => {
          const { data } = event;

          if (data.type === "FORMAT_RESULT" && data.requestId === requestId) {
            settle();
            resolve({ formatted: data.formatted, error: null });
          } else if (data.type === "ERROR" && data.requestId === requestId) {
            settle();
            resolve({ formatted: code, error: data.error.message });
          }
        };

        const onError = (err: ErrorEvent) => {
          if (settled) return;
          settle();
          this.resetWorker();
          resolve({
            formatted: code,
            error: `Worker crashed: ${err.message}`,
          });
        };

        worker.addEventListener("message", onMessage);
        worker.addEventListener("error", onError);

        timer = setTimeout(() => {
          if (settled) return;
          settle();
          this.resetWorker();
          resolve({
            formatted: code,
            error: `Format timed out (limit: ${timeoutMs}ms).`,
          });
        }, timeoutMs);

        const payload: PrettierWorkerInMessage = {
          type: "FORMAT",
          requestId,
          code,
        };
        worker.postMessage(payload);
      });
    });
  }

  dispose(): void {
    this.worker?.terminate();
    this.worker = null;
  }

  private resetWorker(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}

export const javascriptFormatRunner = new JavaScriptFormatRunner();

export { JavaScriptFormatRunner };
