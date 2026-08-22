import { expect, test } from "@playwright/test";

const expectVercelMatchedPath =
  process.env.PLAYWRIGHT_EXPECT_MATCHED_PATH === "true" ||
  (process.env.PLAYWRIGHT_BASE_URL?.includes("vercel.app") ?? false);

/** Merge gate: Pages `i18n` must not break `/api/*` routing on Vercel or locally. */
test.describe("API routes", () => {
  test("auth session and tRPC respond without locale 404", async ({
    request,
  }) => {
    const sessionResponse = await request.get("/api/auth/session");
    expect(sessionResponse.ok()).toBe(true);
    if (expectVercelMatchedPath) {
      expect(sessionResponse.headers()["x-matched-path"]).toBe(
        "/api/auth/[...nextauth]",
      );
    }

    const trpcResponse = await request.get("/api/trpc/project.allBrief");
    expect(trpcResponse.ok()).toBe(true);
    if (expectVercelMatchedPath) {
      expect(trpcResponse.headers()["x-matched-path"]).toBe("/api/trpc/[trpc]");
    }
  });
});
