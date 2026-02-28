import { generate } from "short-uuid";

import type { ExecutionResult } from "../hooks/useCodeExecution";
import type { PythonWorkerOutMessage } from "./workers/pythonExec.worker.types";

const DEFAULT_TIMEOUT_MS = 30_000;

type RunnerState = "idle" | "initializing" | "ready" | "running" | "disposed";

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

  constructor(indexURL?: string) {
    this.indexURL = indexURL;
  }

  /** Warm up the Pyodide worker. Safe to call multiple times. */
  async init(): Promise<void> {
    if (this.state === "ready") return;
    if (this.state === "disposed") {
      throw new Error("PythonRunner has been disposed");
    }
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    this.state = "initializing";
    this.worker = createWorker();

    return new Promise<void>((resolve, reject) => {
      const onMessage = (event: MessageEvent<PythonWorkerOutMessage>) => {
        if (event.data.type === "READY") {
          cleanup();
          this.state = "ready";
          resolve();
        } else if (
          event.data.type === "ERROR" &&
          event.data.requestId === "__init__"
        ) {
          cleanup();
          this.state = "idle";
          this.worker?.terminate();
          this.worker = null;
          reject(new Error(`Pyodide init failed: ${event.data.error.message}`));
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
   * Execute Python code and return the result.
   * Auto-initializes the worker if not yet ready.
   * On timeout, terminates the worker and returns a TLE-shaped result.
   *
   * Calls are serialized: if a run is already in-flight the new call waits
   * for it to finish before proceeding.
   *
   * Never rejects -- all failure modes (timeout, crash, Python error)
   * are represented as an ExecutionResult with a populated `error` field.
   */
  async run(
    code: string,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
  ): Promise<ExecutionResult> {
    if (this.state === "disposed") {
      return makeErrorResult({
        name: "RuntimeError",
        message: "PythonRunner has been disposed.",
      });
    }

    // Serialize: wait for any in-flight run to finish before proceeding
    if (this.state === "running") {
      await this.runGate;
    }

    if (this.state !== "ready") {
      try {
        await this.init();
      } catch (err: unknown) {
        return makeErrorResult({
          name: "InitError",
          message:
            err instanceof Error ? err.message : "Failed to initialize Pyodide",
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

    // Create a gate that subsequent callers can await
    let resolveGate!: () => void;
    this.runGate = new Promise<void>((r) => {
      resolveGate = r;
    });

    try {
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

        worker.postMessage({ type: "RUN", requestId, code });
      });
    } finally {
      resolveGate();
    }
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

  // Gate promise that serializes concurrent run() calls
  private runGate: Promise<void> = Promise.resolve();

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
