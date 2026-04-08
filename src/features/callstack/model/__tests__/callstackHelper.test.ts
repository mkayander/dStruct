import { beforeEach, describe, expect, it, vi } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { SourceLocationSnapshot } from "#/shared/lib/sourceLocationSnapshot";

import { CallstackHelper } from "../callstackSlice";

type ExecutionSourceModule = {
  clearExecutionSource: () => void;
  setExecutionSource: (line: number, column?: number | null) => void;
  peekExecutionSourceForFrame: () => SourceLocationSnapshot | undefined;
};

const { mockPeekExecutionSourceForFrame } = vi.hoisted(() => ({
  mockPeekExecutionSourceForFrame:
    vi.fn<ExecutionSourceModule["peekExecutionSourceForFrame"]>(),
}));

vi.mock(
  "#/features/codeRunner/lib/executionSourceContext",
  async (importOriginal) => {
    const mod = (await importOriginal()) as ExecutionSourceModule;
    return {
      ...mod,
      peekExecutionSourceForFrame: mockPeekExecutionSourceForFrame,
    };
  },
);

const baseTreeFrame = {
  treeName: "main",
  structureType: "treeNode" as const,
  argType: ArgumentType.BINARY_TREE,
  nodeId: "n1",
  id: "id-1",
  timestamp: 0,
};

describe("CallstackHelper", () => {
  beforeEach(() => {
    mockPeekExecutionSourceForFrame.mockReset();
  });

  it("addOne merges source from peek when frame has no source", () => {
    mockPeekExecutionSourceForFrame.mockReturnValue({
      line: 7,
      column: 2,
    });
    const helper = new CallstackHelper();
    helper.addOne({
      ...baseTreeFrame,
      name: "blink",
    });
    expect(helper.frames).toHaveLength(1);
    expect(helper.frames[0]).toMatchObject({
      name: "blink",
      source: { line: 7, column: 2 },
    });
  });

  it("addOne does not overwrite an existing source on the frame", () => {
    mockPeekExecutionSourceForFrame.mockReturnValue({ line: 99 });
    const helper = new CallstackHelper();
    helper.addOne({
      ...baseTreeFrame,
      name: "blink",
      source: { line: 3 },
    });
    expect(helper.frames[0]).toMatchObject({ source: { line: 3 } });
  });

  it("addOne ignores peek for error frames", () => {
    mockPeekExecutionSourceForFrame.mockReturnValue({ line: 1 });
    const helper = new CallstackHelper();
    helper.addOne({
      id: "err",
      timestamp: 0,
      name: "error",
    });
    expect(helper.frames[0]).toEqual({
      id: "err",
      timestamp: 0,
      name: "error",
    });
  });

  it("clear empties frames", () => {
    const helper = new CallstackHelper();
    helper.addOne({ ...baseTreeFrame, name: "blink" });
    helper.clear();
    expect(helper.frames).toHaveLength(0);
  });
});
