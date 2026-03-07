import { describe, expect, it, vi } from "vitest";

import {
  requestBenchmarkWithProgress,
  requestWorkerAction,
} from "#/features/codeRunner/lib/workers/codeExecWorkerInterface";

describe("codeExecWorkerInterface", () => {
  describe("requestBenchmarkWithProgress", () => {
    it("should call onProgress for each benchmark-progress message and resolve with final result", async () => {
      const onProgress = vi.fn();
      const mockWorker = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        postMessage: vi.fn(),
      } as unknown as Worker;

      let messageListener: (event: MessageEvent) => void;
      (
        mockWorker.addEventListener as ReturnType<typeof vi.fn>
      ).mockImplementation(
        (_: string, listener: (event: MessageEvent) => void) => {
          messageListener = listener;
        },
      );

      const benchmarkResult = {
        type: "benchmark" as const,
        workStartTime: 0,
        runtime: 10,
        output: "4",
        averageTime: 0.1,
        medianTime: 0.1,
        p75Time: 0.1,
        p90Time: 0.1,
        p95Time: 0.1,
        p99Time: 0.1,
      };

      const promise = requestBenchmarkWithProgress(
        mockWorker,
        {
          type: "benchmark",
          code: "return () => 4",
          input: [],
          count: 4,
        },
        onProgress,
        5000,
      );

      // Simulate worker sending progress updates
      messageListener!({
        data: { type: "benchmark-progress", current: 1, total: 4 },
      } as MessageEvent);
      messageListener!({
        data: { type: "benchmark-progress", current: 2, total: 4 },
      } as MessageEvent);
      messageListener!({
        data: { type: "benchmark-progress", current: 4, total: 4 },
      } as MessageEvent);
      messageListener!({ data: benchmarkResult } as MessageEvent);

      const result = await promise;

      expect(onProgress).toHaveBeenCalledTimes(3);
      expect(onProgress).toHaveBeenNthCalledWith(1, 1, 4);
      expect(onProgress).toHaveBeenNthCalledWith(2, 2, 4);
      expect(onProgress).toHaveBeenNthCalledWith(3, 4, 4);
      expect(result).toEqual(benchmarkResult);
    });
  });

  describe("requestWorkerAction", () => {
    it("should reject when worker sends error response", async () => {
      const mockWorker = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        postMessage: vi.fn(),
      } as unknown as Worker;

      let messageListener: (event: MessageEvent) => void;
      (
        mockWorker.addEventListener as ReturnType<typeof vi.fn>
      ).mockImplementation(
        (_: string, listener: (event: MessageEvent) => void) => {
          messageListener = listener;
        },
      );

      const promise = requestWorkerAction(mockWorker, "run", {
        type: "run",
        code: "return () => 1",
        caseArgs: [],
        arrayStore: {},
        treeStore: {},
      });

      messageListener!({
        data: {
          type: "run",
          workStartTime: 0,
          runtime: 0,
          error: { name: "Error", message: "Test error" },
        },
      } as MessageEvent);

      await expect(promise).rejects.toEqual({
        name: "Error",
        message: "Test error",
      });
    });
  });
});
