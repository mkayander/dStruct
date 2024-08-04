import "@testing-library/jest-dom/vitest";
import { defineWebWorkers } from "@vitest/web-worker/pure";
import ResizeObserver from "resize-observer-polyfill";
import { TextDecoder, TextEncoder } from "util";
import "vitest-canvas-mock";

defineWebWorkers({ clone: "none" });

Object.assign(global, { TextDecoder, TextEncoder, ResizeObserver });

// Mock env variables
process.env.NEXT_PUBLIC_BUCKET_BASE_URL = "https://leetpal.s3.amazonaws.com";
