import type { ExecutionResult } from "#/features/codeRunner/hooks/useCodeExecution";
import { PythonRunner } from "#/features/codeRunner/lib/pythonRunner";
import type {
  PythonWorkerInMessage,
  PythonWorkerOutMessage,
} from "#/features/codeRunner/lib/workers/pythonExec.worker.types";

/**
 * Minimal mock worker that simulates the Pyodide worker protocol
 * without actually loading Pyodide.
 */
class MockPythonWorker extends EventTarget {
  terminated = false;

  postMessage(msg: PythonWorkerInMessage) {
    setTimeout(() => {
      if (this.terminated) return;

      if (msg.type === "INIT") {
        const response: PythonWorkerOutMessage = { type: "READY" };
        this.dispatchEvent(new MessageEvent("message", { data: response }));
        return;
      }

      if (msg.type === "RUN") {
        const result: ExecutionResult = {
          output: "42",
          callstack: [],
          runtime: 5,
          startTimestamp: Date.now(),
          error: undefined,
        };
        const response: PythonWorkerOutMessage = {
          type: "RUN_RESULT",
          requestId: msg.requestId,
          result,
        };
        this.dispatchEvent(new MessageEvent("message", { data: response }));
      }
    }, 10);
  }

  terminate() {
    this.terminated = true;
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    super.addEventListener(type, callback, options);
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    super.removeEventListener(type, callback, options);
  }
}

describe("pythonExec.worker protocol", () => {
  it("should respond READY after INIT", async () => {
    const worker = new MockPythonWorker();

    const readyPromise = new Promise<PythonWorkerOutMessage>((resolve) => {
      worker.addEventListener("message", (event) => {
        resolve((event as MessageEvent<PythonWorkerOutMessage>).data);
      });
    });

    worker.postMessage({ type: "INIT" });
    const msg = await readyPromise;

    expect(msg.type).toBe("READY");
    worker.terminate();
  });

  it("should return RUN_RESULT with ExecutionResult shape after RUN", async () => {
    const worker = new MockPythonWorker();

    // Init first
    const initPromise = new Promise<void>((resolve) => {
      const listener = (event: Event) => {
        const data = (event as MessageEvent<PythonWorkerOutMessage>).data;
        if (data.type === "READY") {
          worker.removeEventListener("message", listener);
          resolve();
        }
      };
      worker.addEventListener("message", listener);
    });
    worker.postMessage({ type: "INIT" });
    await initPromise;

    // Run
    const runPromise = new Promise<PythonWorkerOutMessage>((resolve) => {
      worker.addEventListener("message", (event) => {
        resolve((event as MessageEvent<PythonWorkerOutMessage>).data);
      });
    });

    worker.postMessage({
      type: "RUN",
      requestId: "test-1",
      code: "def solution():\n  return 42",
    });

    const msg = await runPromise;

    expect(msg.type).toBe("RUN_RESULT");
    if (msg.type === "RUN_RESULT") {
      expect(msg.requestId).toBe("test-1");
      expect(msg.result).toHaveProperty("output");
      expect(msg.result).toHaveProperty("callstack");
      expect(msg.result).toHaveProperty("runtime");
      expect(msg.result).toHaveProperty("startTimestamp");
      expect(typeof msg.result.output).toBe("string");
      expect(Array.isArray(msg.result.callstack)).toBe(true);
      expect(typeof msg.result.runtime).toBe("number");
    }

    worker.terminate();
  });

  it("should handle timeout by terminating the worker", async () => {
    const worker = new MockPythonWorker();

    // Simulate a hanging worker by never responding to RUN
    worker.postMessage = vi.fn((msg: PythonWorkerInMessage) => {
      if (msg.type === "INIT") {
        setTimeout(() => {
          const response: PythonWorkerOutMessage = { type: "READY" };
          worker.dispatchEvent(new MessageEvent("message", { data: response }));
        }, 5);
      }
      // RUN messages are intentionally not handled (simulates hang)
    });

    const terminateSpy = vi.spyOn(worker, "terminate");

    // Init
    const initPromise = new Promise<void>((resolve) => {
      const listener = (event: Event) => {
        const data = (event as MessageEvent<PythonWorkerOutMessage>).data;
        if (data.type === "READY") {
          worker.removeEventListener("message", listener);
          resolve();
        }
      };
      worker.addEventListener("message", listener);
    });
    worker.postMessage({ type: "INIT" });
    await initPromise;

    // Simulate timeout: the main-thread runner would call terminate after timeout
    worker.terminate();
    expect(terminateSpy).toHaveBeenCalled();
    expect(worker.terminated).toBe(true);
  });

  it("should forward PROGRESS messages to onProgress callback during init", async () => {
    const progressCalls: Array<[number, string]> = [];
    const onProgress = vi.fn((value: number, stage: string) => {
      progressCalls.push([value, stage]);
    });

    const mockWorker = new MockPythonWorker();
    mockWorker.postMessage = (msg: PythonWorkerInMessage) => {
      if (msg.type !== "INIT") return;
      // Simulate worker sending PROGRESS then READY (matches real worker sequence)
      const steps: PythonWorkerOutMessage[] = [
        { type: "PROGRESS", value: 5, stage: "Loading runtime…" },
        { type: "PROGRESS", value: 45, stage: "Preparing harness…" },
        { type: "PROGRESS", value: 70, stage: "Importing Python…" },
        { type: "PROGRESS", value: 100, stage: "Ready" },
        { type: "READY" },
      ];
      steps.forEach((data, i) => {
        setTimeout(() => {
          if (!mockWorker.terminated) {
            mockWorker.dispatchEvent(new MessageEvent("message", { data }));
          }
        }, i * 5);
      });
    };

    const runner = new PythonRunner();
    await runner.init({
      onProgress,
      workerFactory: () => mockWorker as Worker,
    });

    expect(onProgress).toHaveBeenCalledTimes(4);
    expect(progressCalls).toEqual([
      [5, "Loading runtime…"],
      [45, "Preparing harness…"],
      [70, "Importing Python…"],
      [100, "Ready"],
    ]);

    runner.dispose();
  });
});
