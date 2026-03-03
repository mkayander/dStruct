import { act, renderHook } from "@testing-library/react";
import { type NextRouter, useRouter } from "next/router";
import React from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeStore } from "#/store/makeStore";

import { useMobilePlaygroundView } from "../useMobilePlaygroundView";

vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

vi.mock("#/shared/hooks/useHasMounted", () => ({
  useHasMounted: () => true,
}));

const store = makeStore();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const mockPush = vi.fn();
const mockReplace = vi.fn();

const createMockRouter = (overrides: Partial<NextRouter> = {}): NextRouter => ({
  pathname: "/playground/[[...slug]]",
  query: {},
  asPath: "/playground",
  basePath: "",
  route: "/playground/[[...slug]]",
  isReady: true,
  isLocaleDomain: false,
  isPreview: false,
  push: mockPush,
  replace: mockReplace,
  reload: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn().mockResolvedValue(undefined),
  beforePopState: vi.fn(),
  events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
  isFallback: false,
  locale: undefined,
  locales: undefined,
  defaultLocale: undefined,
  domainLocales: undefined,
  ...overrides,
});

describe("useMobilePlaygroundView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("currentView resolution", () => {
    it("returns explicit ?view= param when it is a valid view", () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({ query: { view: "results" } }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("results");
    });

    it("ignores invalid ?view= param and falls back", () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({ query: { view: "invalid" } }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("browse");
    });

    it('returns "code" when a project slug is present', () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({ query: { slug: ["invert-binary-tree"] } }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("code");
    });

    it("explicit ?view= overrides project slug default", () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({
          query: { slug: ["some-project"], view: "browse" },
        }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("browse");
    });

    it('returns "code" when localStorage has a last project path', () => {
      localStorage.setItem("lastPlaygroundPath", "/playground/some-project");
      vi.mocked(useRouter).mockReturnValue(createMockRouter({ query: {} }));

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("code");
    });

    it('returns "browse" when localStorage path has no project slug segment', () => {
      localStorage.setItem("lastPlaygroundPath", "/playground/");
      vi.mocked(useRouter).mockReturnValue(createMockRouter({ query: {} }));

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("browse");
    });

    it('returns "browse" when no slug, no param, no localStorage', () => {
      vi.mocked(useRouter).mockReturnValue(createMockRouter({ query: {} }));

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("browse");
    });

    it("uses localStorage when router is not ready (view comes from router.query)", () => {
      Object.defineProperty(window, "location", {
        value: { search: "?view=browse" },
        writable: true,
      });
      localStorage.setItem("lastPlaygroundPath", "/playground/some-project");

      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({ query: {}, isReady: false }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      // Implementation uses router.query, not window.location; empty query + valid localStorage => "code"
      expect(result.current.currentView).toBe("code");
    });

    it("falls back to localStorage when router is not ready and no ?view= in URL", () => {
      Object.defineProperty(window, "location", {
        value: { search: "" },
        writable: true,
      });
      localStorage.setItem("lastPlaygroundPath", "/playground/some-project");

      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({ query: {}, isReady: false }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.currentView).toBe("code");
    });
  });

  describe("hasProjectSlug", () => {
    it("returns true when slug array is non-empty", () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({ query: { slug: ["project-a", "case-b"] } }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.hasProjectSlug).toBe(true);
    });

    it("returns false when slug array is empty", () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({ query: { slug: [] } }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.hasProjectSlug).toBe(false);
    });

    it("returns false when slug is not in the query", () => {
      vi.mocked(useRouter).mockReturnValue(createMockRouter({ query: {} }));

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      expect(result.current.hasProjectSlug).toBe(false);
    });
  });

  describe("navigateTo", () => {
    it("goToResults replaces when on code (squash code↔results history)", () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({
          query: { slug: ["project-a"] },
          asPath: "/playground/project-a",
        }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      act(() => {
        result.current.goToResults();
      });

      const route = {
        pathname: "/playground/project-a",
        query: { view: "results" },
      };
      const opts = { shallow: true };
      expect(mockReplace).toHaveBeenCalledWith(route, undefined, opts);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("goToCode replaces when on results (squash code↔results history)", () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({
          query: { slug: ["project-a"], view: "results" },
          asPath: "/playground/project-a",
        }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      act(() => {
        result.current.goToCode();
      });

      const route = {
        pathname: "/playground/project-a",
        query: { view: "code" },
      };
      const opts = { shallow: true };
      expect(mockReplace).toHaveBeenCalledWith(route, undefined, opts);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("goToBrowse pushes ?view=browse", () => {
      vi.mocked(useRouter).mockReturnValue(
        createMockRouter({
          query: { slug: ["project-a"] },
          asPath: "/playground/project-a",
        }),
      );

      const { result } = renderHook(() => useMobilePlaygroundView(), {
        wrapper,
      });
      act(() => {
        result.current.goToBrowse();
      });

      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: "/playground/project-a",
          query: { view: "browse" },
        },
        undefined,
        { shallow: true },
      );
    });
  });
});
