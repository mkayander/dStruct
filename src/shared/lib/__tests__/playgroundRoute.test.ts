import { describe, expect, it } from "vitest";

import {
  appLocalePlaygroundBasePath,
  buildPlaygroundPath,
  parsePlaygroundPathname,
  PLAYGROUND_PUBLIC_BASE_PATH,
  playgroundBasePathForLocale,
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

  it("normalizes legacy internal-marketing pilot paths to public bases", () => {
    expect(
      parsePlaygroundPathname("/internal-marketing/en/playground"),
    ).toEqual({
      basePath: PLAYGROUND_PUBLIC_BASE_PATH,
      slug: [],
    });
    expect(
      parsePlaygroundPathname(
        "/internal-marketing/de/playground/invert-binary-tree",
      ),
    ).toEqual({
      basePath: appLocalePlaygroundBasePath("de"),
      slug: ["invert-binary-tree"],
    });
  });

  it("parses app/[lang] playground paths", () => {
    const basePath = appLocalePlaygroundBasePath("en");
    expect(parsePlaygroundPathname("/en/playground")).toEqual({
      basePath,
      slug: [],
    });
    expect(
      parsePlaygroundPathname("/de/playground/invert-binary-tree"),
    ).toEqual({
      basePath: appLocalePlaygroundBasePath("de"),
      slug: ["invert-binary-tree"],
    });
  });

  it("returns null for non-playground paths", () => {
    expect(parsePlaygroundPathname("/")).toBeNull();
    expect(parsePlaygroundPathname("/privacy")).toBeNull();
    expect(parsePlaygroundPathname("/internal-marketing/en")).toBeNull();
    expect(parsePlaygroundPathname("/not-a-locale/playground")).toBeNull();
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

  it("playgroundBasePathForLocale uses unprefixed path for default locale", () => {
    expect(playgroundBasePathForLocale("en")).toBe(PLAYGROUND_PUBLIC_BASE_PATH);
    expect(playgroundBasePathForLocale("de")).toBe("/de/playground");
  });

  it("remaps stored paths onto a different base (legacy pilot vs public)", () => {
    const deBase = appLocalePlaygroundBasePath("de");
    expect(
      remapPlaygroundPathToBase("/playground/invert-binary-tree", deBase),
    ).toBe("/de/playground/invert-binary-tree");
    expect(
      remapPlaygroundPathToBase(
        "/internal-marketing/en/playground/foo/bar",
        PLAYGROUND_PUBLIC_BASE_PATH,
      ),
    ).toBe("/playground/foo/bar");
    expect(remapPlaygroundPathToBase("/playground", deBase)).toBeNull();
    expect(
      remapPlaygroundPathToBase("/playground/[[...slug]]", deBase),
    ).toBeNull();
  });
});
