/** Canonical invert-binary-tree path segments (project / case / solution). */
export const INVERT_BINARY_TREE_CANONICAL_PATH =
  "/playground/invert-binary-tree/case-1/solution-1";

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
