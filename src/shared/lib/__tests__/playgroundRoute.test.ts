import { describe, expect, it } from "vitest";

import {
  buildPlaygroundPath,
  internalMarketingPlaygroundBasePath,
  parsePlaygroundPathname,
  PLAYGROUND_PUBLIC_BASE_PATH,
  remapPlaygroundPathToBase,
} from "#/shared/lib/playgroundRoute";

describe("playgroundRoute", () => {
  it("parses public playground root and slugs", () => {
    expect(parsePlaygroundPathname("/playground")).toEqual({
      basePath: PLAYGROUND_PUBLIC_BASE_PATH,
      slug: [],
    });
    expect(parsePlaygroundPathname("/playground/invert-binary-tree")).toEqual({
      basePath: PLAYGROUND_PUBLIC_BASE_PATH,
      slug: ["invert-binary-tree"],
    });
    expect(parsePlaygroundPathname("/playground/foo/bar/baz")).toEqual({
      basePath: PLAYGROUND_PUBLIC_BASE_PATH,
      slug: ["foo", "bar", "baz"],
    });
  });

  it("parses internal-marketing pilot playground paths", () => {
    const basePath = internalMarketingPlaygroundBasePath("de");
    expect(
      parsePlaygroundPathname("/internal-marketing/de/playground"),
    ).toEqual({
      basePath,
      slug: [],
    });
    expect(
      parsePlaygroundPathname(
        "/internal-marketing/de/playground/invert-binary-tree",
      ),
    ).toEqual({
      basePath,
      slug: ["invert-binary-tree"],
    });
  });

  it("returns null for non-playground paths", () => {
    expect(parsePlaygroundPathname("/")).toBeNull();
    expect(parsePlaygroundPathname("/privacy")).toBeNull();
    expect(parsePlaygroundPathname("/internal-marketing/en")).toBeNull();
  });

  it("builds paths from base + slug segments", () => {
    expect(buildPlaygroundPath(PLAYGROUND_PUBLIC_BASE_PATH, [])).toBe(
      "/playground",
    );
    expect(
      buildPlaygroundPath(PLAYGROUND_PUBLIC_BASE_PATH, ["foo", "bar"]),
    ).toBe("/playground/foo/bar");
  });

  it("omits empty slug segments", () => {
    expect(
      buildPlaygroundPath(PLAYGROUND_PUBLIC_BASE_PATH, ["foo", "", "bar"]),
    ).toBe("/playground/foo/bar");
    expect(
      buildPlaygroundPath(PLAYGROUND_PUBLIC_BASE_PATH, ["foo", "case", ""]),
    ).toBe("/playground/foo/case");
  });

  it("remaps stored paths onto a different base (pilot vs public)", () => {
    const pilotBase = internalMarketingPlaygroundBasePath("de");
    expect(
      remapPlaygroundPathToBase("/playground/invert-binary-tree", pilotBase),
    ).toBe("/internal-marketing/de/playground/invert-binary-tree");
    expect(
      remapPlaygroundPathToBase(
        "/internal-marketing/en/playground/foo/bar",
        PLAYGROUND_PUBLIC_BASE_PATH,
      ),
    ).toBe("/playground/foo/bar");
    expect(remapPlaygroundPathToBase("/playground", pilotBase)).toBeNull();
    expect(
      remapPlaygroundPathToBase("/playground/[[...slug]]", pilotBase),
    ).toBeNull();
  });
});
