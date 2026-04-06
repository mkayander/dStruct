import { generate } from "short-uuid";

import type { ExecutionResult } from "../hooks/useCodeExecution";
import type { SerializedPythonArg } from "./createPythonRuntimeArgs";
import type { PythonWorkerOutMessage } from "./workers/pythonExec.worker.types";

const DEFAULT_RUN_TIMEOUT_MS = 30_000;
/** First Black install via micropip can be slow; subsequent formats reuse the package. */
const DEFAULT_FORMAT_TIMEOUT_MS = 120_000;

type RunnerState = "idle" | "initializing" | "ready" | "running" | "disposed";

export type PythonFormatResult = {
  formatted: string;
  error: string | null;
};

function createWorker(): Worker {
  return new Worker(
    new URL(
      "src/features/codeRunner/lib/workers/pythonExec.worker.ts",
      import.meta.url,
    ),
  );
}

function makeErrorResult(error: {
  name: string;
  message: string;
  stack?: string;
}): ExecutionResult {
  return {
    output: "",
    callstack: [],
    runtime: 0,
    startTimestamp: performance.now(),
    error,
  };
}

class PythonRunner {
  private worker: Worker | null = null;
  private state: RunnerState = "idle";
  private initPromise: Promise<void> | null = null;
  private indexURL: string | undefined;

  /** Updated on each init() so concurrent callers receive PROGRESS. */
  private onProgressRef: {
    current: ((value: number, stage: string) => void) | null;
  } = { current: null };

  /** Serializes run(), formatCode(), and any future worker RPCs. */
  private operationGate: Promise<void> = Promise.resolve();

  constructor(indexURL?: string) {
    this.indexURL = indexURL;
  }

  /** Warm up the Pyodide worker. Safe to call multiple times. */
  async init(options?: {
    onProgress?: (value: number, stage: string) => void;
    /** For testing: inject a mock worker instead of creating a real one. */
    workerFactory?: () => Worker;
  }): Promise<void> {
    if (this.state === "disposed") {
      throw new Error("PythonRunner has been disposed");
    }
    // Worker is already up while a run/format is in flight — do not spawn another.
    if (this.state === "ready" || this.state === "running") {
      return Promise.resolve();
    }

    this.onProgressRef.current = options?.onProgress ?? null;

    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInit(options);
    return this.initPromise;
  }

  private async doInit(options?: {
    onProgress?: (value: number, stage: string) => void;
    workerFactory?: () => Worker;
  }): Promise<void> {
    this.state = "initializing";
    this.worker = (options?.workerFactory?.() ?? createWorker()) as Worker;
    this.onProgressRef.current = options?.onProgress ?? null;

    return new Promise<void>((resolve, reject) => {
      const onMessage = (event: MessageEvent<PythonWorkerOutMessage>) => {
        const data = event.data;
        if (data.type === "PROGRESS") {
          this.onProgressRef.current?.(data.value, data.stage);
          return;
        }
        if (data.type === "READY") {
          cleanup();
          this.state = "ready";
          resolve();
        } else if (data.type === "ERROR" && data.requestId === "__init__") {
          cleanup();
          this.state = "idle";
          this.worker?.terminate();
          this.worker = null;
          reject(new Error(`Pyodide init failed: ${data.error.message}`));
        }
      };

      const onError = (err: ErrorEvent) => {
        cleanup();
        this.state = "idle";
        this.worker?.terminate();
        this.worker = null;
        reject(new Error(`Worker error during init: ${err.message}`));
      };

      const cleanup = () => {
        this.worker?.removeEventListener("message", onMessage);
        this.worker?.removeEventListener("error", onError);
        this.initPromise = null;
      };

      this.worker!.addEventListener("message", onMessage);
      this.worker!.addEventListener("error", onError);
      this.worker!.postMessage({
        type: "INIT",
        ...(this.indexURL && { indexURL: this.indexURL }),
      });
    });
  }

  /**
   * One worker operation at a time (run vs format share the same Pyodide).
   */
  private async withSerializedOperation<T>(fn: () => Promise<T>): Promise<T> {
    await this.operationGate;
    let release!: () => void;
    this.operationGate = new Promise<void>((resolveGate) => {
      release = resolveGate;
    });
    try {
      return await fn();
    } finally {
      release();
    }
  }

  /**
   * Execute Python code and return the result.
   * Auto-initializes the worker if not yet ready.
   * On timeout, terminates the worker and returns a TLE-shaped result.
   *
   * Never rejects -- all failure modes (timeout, crash, Python error)
   * are represented as an ExecutionResult with a populated `error` field.
   */
  async run(
    code: string,
    timeoutMs: number = DEFAULT_RUN_TIMEOUT_MS,
    args?: SerializedPythonArg[],
  ): Promise<ExecutionResult> {
    if (this.state === "disposed") {
      return makeErrorResult({
        name: "RuntimeError",
        message: "PythonRunner has been disposed.",
      });
    }

    return this.withSerializedOperation(async () => {
      if (this.state !== "ready") {
        try {
          await this.init();
        } catch (err: unknown) {
          return makeErrorResult({
            name: "InitError",
            message:
              err instanceof Error
                ? err.message
                : "Failed to initialize Pyodide",
          });
        }
      }

      const worker = this.worker;
      if (!worker) {
        return makeErrorResult({
          name: "RuntimeError",
          message: "Worker unavailable after init.",
        });
      }

      this.state = "running";
      const requestId = generate();

      return await new Promise<ExecutionResult>((resolve) => {
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

        const onMessage = (event: MessageEvent<PythonWorkerOutMessage>) => {
          const { data } = event;

          if (data.type === "RUN_RESULT" && data.requestId === requestId) {
            settle();
            this.state = "ready";
            resolve(data.result);
          } else if (data.type === "ERROR" && data.requestId === requestId) {
            settle();
            this.state = "ready";
            resolve(makeErrorResult(data.error));
          }
        };

        const onError = (err: ErrorEvent) => {
          if (settled) return;
          settle();
          this.resetWorker();
          resolve(
            makeErrorResult({
              name: "WorkerError",
              message: `Worker crashed: ${err.message}`,
            }),
          );
        };

        worker.addEventListener("message", onMessage);
        worker.addEventListener("error", onError);

        timer = setTimeout(() => {
          if (settled) return;
          settle();
          this.resetWorker();
          resolve(
            makeErrorResult({
              name: "TimeoutError",
              message: `Execution timed out (limit: ${timeoutMs}ms). Possible infinite loop.`,
            }),
          );
        }, timeoutMs);

        worker.postMessage({ type: "RUN", requestId, code, args });
      });
    });
  }

  /**
   * Format Python with Black inside Pyodide (micropip on first use).
   * Serialized with `run()`; returns original `code` when formatting fails.
   */
  async formatCode(
    code: string,
    timeoutMs: number = DEFAULT_FORMAT_TIMEOUT_MS,
  ): Promise<PythonFormatResult> {
    if (this.state === "disposed") {
      return {
        formatted: code,
        error: "Python runner has been disposed.",
      };
    }

    return this.withSerializedOperation(async () => {
      if (this.state !== "ready") {
        try {
          await this.init();
        } catch (err: unknown) {
          return {
            formatted: code,
            error:
              err instanceof Error
                ? err.message
                : "Failed to initialize Pyodide",
          };
        }
      }

      const worker = this.worker;
      if (!worker) {
        return { formatted: code, error: "Worker unavailable after init." };
      }

      this.state = "running";
      const requestId = generate();

      return await new Promise<PythonFormatResult>((resolve) => {
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

        const onMessage = (event: MessageEvent<PythonWorkerOutMessage>) => {
          const { data } = event;

          if (data.type === "FORMAT_RESULT" && data.requestId === requestId) {
            settle();
            this.state = "ready";
            resolve({ formatted: data.formatted, error: null });
          } else if (data.type === "ERROR" && data.requestId === requestId) {
            settle();
            this.state = "ready";
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

        worker.postMessage({ type: "FORMAT", requestId, code });
      });
    });
  }

  /** Terminate the worker and release resources. */
  dispose(): void {
    this.state = "disposed";
    this.initPromise = null;
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  /** Whether the runner has a warm, ready-to-use worker. */
  get isReady(): boolean {
    return this.state === "ready";
  }

  /** Kill the worker and reset to idle so a fresh worker is created on next use. */
  private resetWorker(): void {
    this.worker?.terminate();
    this.worker = null;
    this.state = "idle";
    this.initPromise = null;
  }
}

/** Singleton runner instance for the application. */
export const pythonRunner = new PythonRunner();

/** Exported for testing. */
export { PythonRunner };
