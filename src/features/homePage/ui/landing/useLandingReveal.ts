import type { CSSObject } from "@mui/material/styles";
import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type UseLandingRevealOptions = {
  /** Extra delay after intersecting (e.g. stagger between siblings). */
  staggerMs?: number;
};

type RevealState = "pending" | "reduce" | "static" | "hidden" | "revealed";

const hiddenSx: CSSObject = {
  opacity: 0,
  transform: "translate3d(0, 14px, 0)",
  transition: "none",
};

const prefersReducedMotion = () => {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const inViewportLoose = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.top < vh * 0.92 && rect.bottom > -40;
};

/**
 * Scroll-triggered entrance: `pending` is **fully visible** (matches SSR / first paint — no flash).
 * After layout: in-viewport → `static`; below-fold → `hidden` until IO, then `revealed`.
 * Respects `prefers-reduced-motion: reduce`.
 */
export const useLandingReveal = (
  ref: RefObject<HTMLDivElement | null>,
  options: UseLandingRevealOptions = {},
): { revealSx: CSSObject } => {
  const { staggerMs = 0 } = options;
  const [state, setState] = useState<RevealState>("pending");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setState("reduce");
      return;
    }

    if (inViewportLoose(el)) {
      setState("static");
    } else {
      setState("hidden");
    }
  }, [ref]);

  useEffect(() => {
    if (state !== "hidden") return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver !== "function") {
      setState("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        observer.disconnect();
        if (staggerMs > 0) {
          window.setTimeout(() => setState("revealed"), staggerMs);
        } else {
          setState("revealed");
        }
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, state, staggerMs]);

  const revealSx = useMemo((): CSSObject => {
    if (state === "pending" || state === "reduce" || state === "static") {
      return {};
    }

    if (state === "hidden") {
      return hiddenSx;
    }

    return {
      opacity: 1,
      transform: "translate3d(0, 0, 0)",
      transition:
        "opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
    };
  }, [state]);

  return { revealSx };
};
