/** Append `?view=code` for mobile canonical playground navigations when no view is set. */
export function appendPlaygroundMobileViewQuery(
  path: string,
  options: {
    isMobile: boolean;
    hasViewParam: boolean;
    hasCanonicalSlug: boolean;
  },
): string {
  if (!options.isMobile || !options.hasCanonicalSlug || options.hasViewParam) {
    return path;
  }

  return `${path}?view=code`;
}
