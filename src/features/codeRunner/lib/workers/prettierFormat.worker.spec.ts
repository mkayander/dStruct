import type {
  PrettierWorkerInMessage,
  PrettierWorkerOutMessage,
} from "#/features/codeRunner/lib/workers/prettierFormat.worker.types";

class MockPrettierWorker
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

  postMessage(msg: PrettierWorkerInMessage) {
    setTimeout(() => {
      if (this.terminated) return;

      if (msg.type === "FORMAT") {
        const response: PrettierWorkerOutMessage = {
          type: "FORMAT_RESULT",
          requestId: msg.requestId,
          formatted: `${msg.code}\n// formatted`,
        };
        this.dispatchEvent(new MessageEvent("message", { data: response }));
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

describe("prettierFormat.worker protocol", () => {
  it("returns FORMAT_RESULT after FORMAT", async () => {
    const worker = new MockPrettierWorker();

    const formatPromise = new Promise<PrettierWorkerOutMessage>((resolve) => {
      worker.addEventListener("message", (event) => {
        resolve((event as MessageEvent<PrettierWorkerOutMessage>).data);
      });
    });

    worker.postMessage({
      type: "FORMAT",
      requestId: "fmt-js-1",
      code: "const x=1",
    });

    const msg = await formatPromise;

    expect(msg.type).toBe("FORMAT_RESULT");
    if (msg.type === "FORMAT_RESULT") {
      expect(msg.requestId).toBe("fmt-js-1");
      expect(msg.formatted).toContain("const x=1");
    }

    worker.terminate();
  });
});
