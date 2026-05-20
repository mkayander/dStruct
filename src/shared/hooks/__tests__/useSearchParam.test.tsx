import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearchParam } from "#/shared/hooks/useSearchParam";

const mockPush = vi.fn();
const mockReplace = vi.fn();

let mockQuery: Record<string, string | string[] | undefined> = {};

vi.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/playground",
    query: mockQuery,
    push: mockPush,
    replace: mockReplace,
  }),
}));

describe("useSearchParam", () => {
  beforeEach(() => {
    mockQuery = {};
    mockPush.mockReset();
    mockReplace.mockReset();
  });

  it("initializes from router.query when the param is valid", () => {
    mockQuery = { view: "browse" };

    const { result } = renderHook(() => useSearchParam("view"));

    expect(result.current[0]).toBe("browse");
  });

  it("falls back to defaultValue when the param is missing or invalid", () => {
    mockQuery = { view: "grid" };

    const { result } = renderHook(() =>
      useSearchParam("view", {
        defaultValue: "list",
        validate: (value): value is "list" | "browse" =>
          value === "list" || value === "browse",
      }),
    );

    expect(result.current[0]).toBe("list");
  });

  it("syncs local state when router.query changes", async () => {
    mockQuery = { view: "list" };

    const { result, rerender } = renderHook(() => useSearchParam("view"));

    expect(result.current[0]).toBe("list");

    mockQuery = { view: "browse" };
    rerender();

    await waitFor(() => {
      expect(result.current[0]).toBe("browse");
    });
  });

  it("updateParam pushes a shallow route without the playground slug query key", async () => {
    mockQuery = { slug: "two-sum", view: "list" };
    mockPush.mockImplementation((route) => {
      if (typeof route === "object" && route.query) {
        mockQuery = route.query as Record<
          string,
          string | string[] | undefined
        >;
      }
    });

    const { result } = renderHook(() => useSearchParam("view"));

    act(() => {
      result.current[1]("browse");
    });

    expect(mockPush).toHaveBeenCalledWith(
      { pathname: "/playground", query: { view: "browse" } },
      undefined,
      { shallow: true },
    );

    await waitFor(() => {
      expect(result.current[0]).toBe("browse");
    });
  });

  it("updateParam with replace uses router.replace", () => {
    const { result } = renderHook(() => useSearchParam("view"));

    act(() => {
      result.current[1]("browse", { replace: true });
    });

    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: "/playground", query: { view: "browse" } },
      undefined,
      { shallow: true },
    );
  });
});
