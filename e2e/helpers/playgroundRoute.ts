/** Canonical invert-binary-tree path segments (project / case / solution). */
export const INVERT_BINARY_TREE_CANONICAL_PATH =
  "/playground/invert-binary-tree/case-1/solution-1";

/** True when pathname includes playground + project + case + solution segments. */
export function hasCanonicalPlaygroundSlugPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  const playgroundIndex = segments.indexOf("playground");
  if (playgroundIndex === -1) {
    return false;
  }

  return segments.length - playgroundIndex - 1 >= 3;
}

export function isCanonicalPlaygroundProjectPath(
  pathname: string,
  projectSlug: string,
): boolean {
  const segments = pathname.split("/").filter(Boolean);
  const playgroundIndex = segments.indexOf("playground");
  if (playgroundIndex === -1) {
    return false;
  }

  const projectIndex = playgroundIndex + 1;
  return (
    segments[projectIndex] === projectSlug &&
    segments.length >= projectIndex + 3
  );
}

export function isInvertBinaryTreeCanonicalPath(pathname: string): boolean {
  return isCanonicalPlaygroundProjectPath(pathname, "invert-binary-tree");
}
