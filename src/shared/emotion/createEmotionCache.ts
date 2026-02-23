import createCache from "@emotion/cache";

/**
 * Creates an Emotion cache with a consistent key so that server and client
 * generate the same class names (fixes hydration mismatch with MUI).
 * Use the same key in _document getInitialProps (server) and in _app (client).
 */
export function createEmotionCache() {
  return createCache({
    key: "css",
    prepend: true,
  });
}
