/** Cookie mirror of `lastPlaygroundPath` localStorage for server-side restore. */
export const LAST_PLAYGROUND_PATH_COOKIE = "dstruct-last-playground-path";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Client-only: persist the last playground pathname for server restore on cold load. */
export const setLastPlaygroundPathCookie = (pathname: string): void => {
  if (typeof document === "undefined") {
    return;
  }

  const encoded = encodeURIComponent(pathname);
  document.cookie = `${LAST_PLAYGROUND_PATH_COOKIE}=${encoded}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
};

/** Client-only: clear the last playground pathname cookie. */
export const clearLastPlaygroundPathCookie = (): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${LAST_PLAYGROUND_PATH_COOKIE}=; path=/; max-age=0; samesite=lax`;
};
