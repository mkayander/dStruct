import { defineConfig, devices } from "@playwright/test";

import { vercelProtectionBypassHeaders } from "./src/shared/lib/vercelPreviewHeaders";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
const isRemotePreview = Boolean(process.env.PLAYWRIGHT_BASE_URL);

/** Playwright e2e for App Router pilot routes (Instant Nav groundwork). */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: isRemotePreview ? undefined : "./e2e/global-setup.ts",
  timeout: 60_000,
  use: {
    baseURL,
    extraHTTPHeaders: vercelProtectionBypassHeaders(),
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: isRemotePreview
    ? undefined
    : {
        command: "pnpm dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
