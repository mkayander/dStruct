import "@testing-library/jest-dom/vitest";
import { defineWebWorkers } from "@vitest/web-worker/pure";
import ResizeObserver from "resize-observer-polyfill";
import { TextDecoder, TextEncoder } from "util";
import { vi } from "vitest";
import "vitest-canvas-mock";

// Set SKIP_ENV_VALIDATION before any imports that might trigger env validation
process.env.SKIP_ENV_VALIDATION = "1";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useParams: () => ({}),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

defineWebWorkers({ clone: "none" });

Object.assign(global, { TextDecoder, TextEncoder, ResizeObserver });

// Mock env variables
process.env.NEXT_PUBLIC_BUCKET_BASE_URL = "https://leetpal.s3.amazonaws.com";
