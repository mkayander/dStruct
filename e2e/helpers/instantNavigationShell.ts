import type { APIRequestContext } from "@playwright/test";

const INSTANT_TESTING_COOKIE = "next-instant-navigation-testing=1";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isDevInstantMpaBailout(html: string): boolean {
  return (
    html.includes("BAILOUT_TO_CLIENT_SIDE_RENDERING") ||
    html.includes('"page":"/_error"')
  );
}

/** SSR `<h1>` in instant MPA HTML (not i18n copy embedded only in RSC payload). */
function htmlHasVisibleHeading(html: string, expectedText: string): boolean {
  const headingPattern = new RegExp(
    `<h1[^>]*>[^<]*${escapeRegex(expectedText)}`,
    "i",
  );
  return headingPattern.test(html);
}

/**
 * True when instant MPA mode returns a prerendered App Router shell (preview/prod),
 * not the dev CSR-bail empty shell.
 */
export async function hasProductionInstantShell(
  request: APIRequestContext,
  path: string,
  expectedHeading: string,
): Promise<boolean> {
  const response = await request.get(path, {
    headers: { cookie: INSTANT_TESTING_COOKIE },
  });
  if (!response.ok()) {
    return false;
  }
  const html = await response.text();
  if (isDevInstantMpaBailout(html)) {
    return false;
  }
  return htmlHasVisibleHeading(html, expectedHeading);
}
