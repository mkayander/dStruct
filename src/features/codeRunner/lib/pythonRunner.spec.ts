import type { ExecutionResult } from "#/features/codeRunner/hooks/useCodeExecution";
import { PythonRunner } from "#/features/codeRunner/lib/pythonRunner";
import type {
  PythonWorkerInMessage,
  PythonWorkerOutMessage,
} from "#/features/codeRunner/lib/workers/pythonExec.worker.types";

class MockPythonWorker
  extends EventTarget
  implements
    Pick<
      Worker,
      "postMessage" | "terminate" | "addEventListener" | "removeEventListener"
    >
{
  terminated = false;

  onerror: Worker["onerror"] = null;
  onmessage: Worker["onmessage"] = null;
  onmessageerror: Worker["onmessageerror"] = null;

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
          output: "",
          callstack: [],
          runtime: 0,
          startTimestamp: 0,
        };
        this.dispatchEvent(
          new MessageEvent("message", {
            data: {
              type: "RUN_RESULT",
              requestId: msg.requestId,
              result,
            } satisfies PythonWorkerOutMessage,
          }),
        );
        return;
      }

      if (msg.type === "FORMAT") {
        this.dispatchEvent(
          new MessageEvent("message", {
            data: {
              type: "FORMAT_RESULT",
              requestId: msg.requestId,
              formatted: `${msg.code}\n# fmt`,
            } satisfies PythonWorkerOutMessage,
          }),
        );
      }
    }, 5);
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

describe("PythonRunner.formatCode", () => {
  it("returns formatted source from worker FORMAT_RESULT", async () => {
    const runner = new PythonRunner();
    await runner.init({ workerFactory: () => new MockPythonWorker() });

    const { formatted, error } = await runner.formatCode("x = 1", 10_000);

    expect(error).toBeNull();
    expect(formatted).toBe("x = 1\n# fmt");

    runner.dispose();
  });
});
