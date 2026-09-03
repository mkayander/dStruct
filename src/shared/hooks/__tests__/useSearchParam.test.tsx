import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearchParam } from "#/shared/hooks/useSearchParam";

const mockPush = vi.fn();
const mockReplace = vi.fn();

let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => "/playground/two-sum",
  useParams: () => ({}),
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("useSearchParam", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    mockPush.mockReset();
    mockReplace.mockReset();
  });

  it("initializes from search params when the param is valid", () => {
    mockSearchParams = new URLSearchParams("view=browse");

    const { result } = renderHook(() => useSearchParam("view"));

    expect(result.current[0]).toBe("browse");
  });

  it("falls back to defaultValue when the param is missing or invalid", () => {
    mockSearchParams = new URLSearchParams("view=grid");

    const { result } = renderHook(() =>
      useSearchParam("view", {
        defaultValue: "list",
        validate: (value): value is "list" | "browse" =>
          value === "list" || value === "browse",
      }),
    );

    expect(result.current[0]).toBe("list");
  });

  it("syncs local state when search params change", async () => {
    mockSearchParams = new URLSearchParams("view=list");

    const { result, rerender } = renderHook(() => useSearchParam("view"));

    expect(result.current[0]).toBe("list");

    mockSearchParams = new URLSearchParams("view=browse");
    rerender();

    await waitFor(() => {
      expect(result.current[0]).toBe("browse");
    });
  });

  it("resets to defaultValue when the param is removed from the URL", async () => {
    mockSearchParams = new URLSearchParams("view=browse");

    const { result, rerender } = renderHook(() => useSearchParam("view"));

    expect(result.current[0]).toBe("browse");

    mockSearchParams = new URLSearchParams();
    rerender();

    await waitFor(() => {
      expect(result.current[0]).toBe("");
    });
  });

  it("updateParam pushes an href with the updated query string", async () => {
    mockSearchParams = new URLSearchParams("view=list");

    const { result } = renderHook(() => useSearchParam("view"));

    act(() => {
      result.current[1]("browse");
    });

    expect(mockPush).toHaveBeenCalledWith("/playground/two-sum?view=browse", {
      scroll: false,
    });

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
      "/playground/two-sum?view=browse",
      { scroll: false },
    );
  });

  it("updateParam with pathName targets a custom pathname", () => {
    const { result } = renderHook(() => useSearchParam("view"));

    act(() => {
      result.current[1]("code", {
        replace: true,
        pathName: "/playground/project-a",
      });
    });

    expect(mockReplace).toHaveBeenCalledWith(
      "/playground/project-a?view=code",
      { scroll: false },
    );
  });
});
