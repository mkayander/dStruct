import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeStore } from "#/store/makeStore";

import { useMobilePlaygroundView } from "../useMobilePlaygroundView";

const mockPush = vi.fn();
const mockReplace = vi.fn();

let mockPathname = "/playground";
let mockParams: Record<string, string | string[] | undefined> = {};
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useParams: () => mockParams,
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("#/shared/hooks/useHasMounted", () => ({
  useHasMounted: () => true,
}));

const store = makeStore();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe("useMobilePlaygroundView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockPathname = "/playground";
    mockParams = {};
    mockSearchParams = new URLSearchParams();
  });

  describe("currentView resolution", () => {
    it("returns explicit ?view= param when it is a valid view", () => {
      mockSearchParams = new URLSearchParams("view=results");

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("results");
    });

    it("ignores invalid ?view= param and falls back", () => {
      mockSearchParams = new URLSearchParams("view=invalid");

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("browse");
    });

    it('returns "code" when a project slug is present', () => {
      mockPathname = "/playground/invert-binary-tree";
      mockParams = { slug: ["invert-binary-tree"] };

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("code");
    });

    it("explicit ?view= overrides project slug default", () => {
      mockPathname = "/playground/some-project";
      mockParams = { slug: ["some-project"] };
      mockSearchParams = new URLSearchParams("view=browse");

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("browse");
    });

    it('returns "code" when localStorage has a last project path', () => {
      localStorage.setItem("lastPlaygroundPath", "/playground/some-project");

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("code");
    });

    it('returns "browse" when localStorage path has no project slug segment', () => {
      localStorage.setItem("lastPlaygroundPath", "/playground/");

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("browse");
    });

    it('returns "browse" when no slug, no param, no localStorage', () => {
      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("browse");
    });
  });

  describe("hasProjectSlug", () => {
    it("returns true when slug array is non-empty", () => {
      mockPathname = "/playground/project-a/case-b";
      mockParams = { slug: ["project-a", "case-b"] };

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.hasProjectSlug).toBe(true);
    });

    it("returns false when slug array is empty", () => {
      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.hasProjectSlug).toBe(false);
    });
  });

  describe("implicit view param sync", () => {
    it("replaces URL with ?view=code when a project slug is present but view is omitted", async () => {
      mockPathname = "/playground/project-a";
      mockParams = { slug: ["project-a"] };

      renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          "/playground/project-a?view=code",
          { scroll: false },
        );
      });
    });

    it("does not sync when view is already set", async () => {
      mockPathname = "/playground/project-a";
      mockParams = { slug: ["project-a"] };
      mockSearchParams = new URLSearchParams("view=browse");

      renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });

      await act(async () => {
        await Promise.resolve();
      });

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe("navigateTo", () => {
    it("goToResults replaces ?view=results when on code", () => {
      mockPathname = "/playground/project-a";
      mockParams = { slug: ["project-a"] };
      mockSearchParams = new URLSearchParams("view=code");

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      act(() => {
        result.current.goToResults();
      });

      expect(mockReplace).toHaveBeenCalledWith(
        "/playground/project-a?view=results",
        { scroll: false },
      );
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("goToCode replaces ?view=code when on results", () => {
      mockPathname = "/playground/project-a";
      mockParams = { slug: ["project-a"] };
      mockSearchParams = new URLSearchParams("view=results");

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      act(() => {
        result.current.goToCode();
      });

      expect(mockReplace).toHaveBeenCalledWith(
        "/playground/project-a?view=code",
        { scroll: false },
      );
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("goToBrowse replaces ?view=browse", () => {
      mockPathname = "/playground/project-a";
      mockParams = { slug: ["project-a"] };
      mockSearchParams = new URLSearchParams("view=code");

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      act(() => {
        result.current.goToBrowse();
      });

      expect(mockReplace).toHaveBeenCalledWith(
        "/playground/project-a?view=browse",
        { scroll: false },
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
