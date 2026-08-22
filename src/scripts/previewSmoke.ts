#!/usr/bin/env tsx
/**
 * Vercel/preview merge-gate smoke checks (API routing + pilot routes).
 *
 * Usage:
 *   PLAYWRIGHT_BASE_URL=https://your-preview.vercel.app pnpm preview-smoke
 *   pnpm preview-smoke   # defaults to http://localhost:3000
 *
 * Protected previews: set VERCEL_AUTOMATION_BYPASS_SECRET (same as CI e2e workflow).
 */
import { vercelProtectionBypassHeaders } from "#/shared/lib/vercelPreviewHeaders";

const baseURL = (
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const previewRequestHeaders = vercelProtectionBypassHeaders();

const expectVercelMatchedPath =
  process.env.PLAYWRIGHT_EXPECT_MATCHED_PATH === "true" ||
  baseURL.includes("vercel.app");

type SmokeResult = {
  path: string;
  status: number;
  ok: boolean;
  detail?: string;
};

async function fetchStatus(path: string): Promise<SmokeResult> {
  const url = `${baseURL}${path}`;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: previewRequestHeaders,
    });
    return { path, status: response.status, ok: response.ok };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { path, status: 0, ok: false, detail: message };
  }
}

async function fetchApiGate(
  path: string,
  matchedPath: string,
): Promise<SmokeResult> {
  const url = `${baseURL}${path}`;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: previewRequestHeaders,
    });
    const matched = response.headers.get("x-matched-path");
    const ok =
      response.ok && (!expectVercelMatchedPath || matched === matchedPath);
    const detail =
      expectVercelMatchedPath && matched !== matchedPath
        ? `x-matched-path=${matched ?? "(missing)"}, expected ${matchedPath}`
        : undefined;
    return { path, status: response.status, ok, detail };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { path, status: 0, ok: false, detail: message };
  }
}

const pagePaths = [
  "/",
  "/de",
  "/privacy",
  "/playground",
  "/profile/smoke-user",
  "/internal-marketing/en",
  "/internal-marketing/en/privacy",
  "/internal-marketing/en/daily",
  "/internal-marketing/en/playground",
  "/internal-marketing/en/playground/invert-binary-tree",
  "/internal-marketing/en/profile/smoke-user",
  "/en",
  "/en/privacy",
  "/en/daily",
  "/en/playground",
  "/de/playground/invert-binary-tree",
  "/en/profile/smoke-user",
];

const apiChecks: Array<{ path: string; matchedPath: string }> = [
  { path: "/api/auth/session", matchedPath: "/api/auth/[...nextauth]" },
  { path: "/api/trpc/project.allBrief", matchedPath: "/api/trpc/[trpc]" },
];

async function main(): Promise<void> {
  console.log(`Preview smoke: ${baseURL}`);
  if (expectVercelMatchedPath) {
    console.log("(asserting x-matched-path on API routes)\n");
  } else {
    console.log(
      "(skipping x-matched-path — set PLAYWRIGHT_EXPECT_MATCHED_PATH=true on Vercel)\n",
    );
  }

  const apiResults = await Promise.all(
    apiChecks.map(({ path, matchedPath }) => fetchApiGate(path, matchedPath)),
  );
  const pageResults = await Promise.all(pagePaths.map(fetchStatus));

  const print = (results: SmokeResult[]) => {
    for (const result of results) {
      const suffix = result.detail ? ` (${result.detail})` : "";
      const mark = result.ok ? "OK" : "FAIL";
      console.log(`${mark} ${result.path} -> ${result.status}${suffix}`);
    }
  };

  console.log("API merge gate:");
  print(apiResults);
  console.log("\nPages:");
  print(pageResults);

  const failed = [...apiResults, ...pageResults].filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log("\nAll checks passed.");
}

void main();
