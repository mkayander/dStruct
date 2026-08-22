import { renderHook } from "@testing-library/react";
import { useRouter } from "next/compat/router";
import type { NextRouter } from "next/router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useProfileUserId } from "#/shared/hooks/useProfileUserId";

vi.mock("next/compat/router", () => ({
  useRouter: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ userId: "app-user-id" }),
}));

const mockUseRouter = vi.mocked(useRouter);

const createMockRouter = (overrides: Partial<NextRouter> = {}): NextRouter =>
  ({
    query: {},
    ...overrides,
  }) as NextRouter;

describe("useProfileUserId", () => {
  beforeEach(() => {
    mockUseRouter.mockReset();
  });

  it("reads userId from Pages router query when mounted", () => {
    mockUseRouter.mockReturnValue(
      createMockRouter({ query: { userId: "pages-user-id" } }),
    );

    const { result } = renderHook(() => useProfileUserId());

    expect(result.current).toBe("pages-user-id");
  });

  it("reads userId from App params when Pages router is null", () => {
    mockUseRouter.mockReturnValue(null);

    const { result } = renderHook(() => useProfileUserId());

    expect(result.current).toBe("app-user-id");
  });
});
