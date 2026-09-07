import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetchLeetCodeQuestionMetadata = vi.fn();

vi.mock("#/server/leetcode/fetchLeetCodeQuestionMetadata", () => ({
  fetchLeetCodeQuestionMetadata: (titleSlug: string) =>
    mockFetchLeetCodeQuestionMetadata(titleSlug),
}));

describe("leetcode.getQuestionMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns question metadata from LeetCode", async () => {
    mockFetchLeetCodeQuestionMetadata.mockResolvedValue({
      title: "Two Sum",
      titleSlug: "two-sum",
      difficulty: "Easy",
    });

    const { leetcodeRouter } = await import("#/server/api/routers/leetcode");
    const caller = leetcodeRouter.createCaller({
      session: null,
      db: {} as never,
    });

    const result = await caller.getQuestionMetadata({ titleSlug: "two-sum" });

    expect(mockFetchLeetCodeQuestionMetadata).toHaveBeenCalledWith("two-sum");
    expect(result).toEqual({
      title: "Two Sum",
      titleSlug: "two-sum",
      difficulty: "Easy",
    });
  });

  it("returns null when upstream fetch fails", async () => {
    mockFetchLeetCodeQuestionMetadata.mockResolvedValue(null);

    const { leetcodeRouter } = await import("#/server/api/routers/leetcode");
    const caller = leetcodeRouter.createCaller({
      session: null,
      db: {} as never,
    });

    const result = await caller.getQuestionMetadata({
      titleSlug: "missing-problem",
    });

    expect(result).toBeNull();
  });
});
