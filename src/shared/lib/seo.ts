export const SITE_ORIGIN = "https://dstruct.pro" as const;

export const DEFAULT_SITE_DESCRIPTION =
  "dStruct is a web app that helps you understand LeetCode problems. It allows you to visualize your solutions that you write in a built-in code editor.";

const DEFAULT_OG_IMAGE_PATH = "/static/screen2.png";

export const defaultOgImageUrl = (): string =>
  `${SITE_ORIGIN}${DEFAULT_OG_IMAGE_PATH}`;

/** Keep meta descriptions within a typical snippet-friendly length. */
export const truncateMetaDescription = (text: string, maxLength = 155): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};
