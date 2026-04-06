import { JavaScriptFormatRunner } from "#/features/codeRunner/lib/javascriptFormatRunner";
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
        this.dispatchEvent(
          new MessageEvent("message", {
            data: {
              type: "FORMAT_RESULT",
              requestId: msg.requestId,
              formatted: `${msg.code};`,
            } satisfies PrettierWorkerOutMessage,
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

describe("JavaScriptFormatRunner.formatCode", () => {
  it("returns formatted source from worker FORMAT_RESULT", async () => {
    const runner = new JavaScriptFormatRunner(() => new MockPrettierWorker());

    const { formatted, error } = await runner.formatCode("const a = 1", 10_000);

    expect(error).toBeNull();
    expect(formatted).toBe("const a = 1;");

    runner.dispose();
  });
});
