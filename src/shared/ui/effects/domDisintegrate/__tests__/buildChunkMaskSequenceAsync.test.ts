import { afterEach, describe, expect, it, vi } from "vitest";

import { createTestDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/__tests__/createTestDisintegrateParticle";

const workerInstances: MockWorker[] = [];

class MockWorker {
  public onmessage: ((event: MessageEvent) => void) | null = null;

  public onerror: (() => void) | null = null;

  private readonly listeners = new Map<string, (event: MessageEvent) => void>();

  constructor(
    public readonly url: string | URL,
    public readonly options?: WorkerOptions,
  ) {
    workerInstances.push(this);
  }

  addEventListener(
    type: string,
    listener: (event: MessageEvent) => void,
  ): void {
    this.listeners.set(type, listener);
  }

  removeEventListener(type: string): void {
    this.listeners.delete(type);
  }

  postMessage(data: unknown): void {
    const messageListener = this.listeners.get("message");
    if (!messageListener) {
      return;
    }

    void messageListener(
      new MessageEvent("message", {
        data: {
          type: "ERROR",
          requestId: (data as { requestId: number }).requestId,
          message: "worker exploded",
        },
      }),
    );
  }

  terminate(): void {}
}

vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker);

const { buildChunkMaskSequenceAsync, terminateChunkMaskWorker } =
  await import("#/shared/ui/effects/domDisintegrate/buildChunkMaskSequenceAsync");

const maskInput = {
  particles: [createTestDisintegrateParticle({ x: 0, y: 0, releaseTime: 0 })],
  displayWidth: 12,
  displayHeight: 6,
  particlePadding: 4,
  particleRevealMargin: 6,
  chunkSize: 3,
  maxSteps: 8,
};

describe("buildChunkMaskSequenceAsync", () => {
  afterEach(() => {
    terminateChunkMaskWorker();
    workerInstances.length = 0;
    vi.unstubAllGlobals();
  });

  it("builds masks with a yielding main-thread path when workers are disabled", async () => {
    const sequence = await buildChunkMaskSequenceAsync(maskInput, false);

    expect(sequence).not.toBeNull();
    expect(sequence!.modalMaskUrls.length).toBeGreaterThan(0);
    expect(sequence!.particleMaskUrls).toHaveLength(
      sequence!.modalMaskUrls.length,
    );
  });

  it("falls back to the main thread when the worker reports an error", async () => {
    vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const sequence = await buildChunkMaskSequenceAsync(maskInput, true);

    expect(sequence).not.toBeNull();
    expect(sequence!.modalMaskUrls.length).toBeGreaterThan(0);
    expect(workerInstances.length).toBeGreaterThan(0);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
