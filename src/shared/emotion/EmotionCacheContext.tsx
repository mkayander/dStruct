import type { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import React, { createContext, useContext, useMemo } from "react";

import { createEmotionCache } from "#/shared/emotion/createEmotionCache";

/**
 * Set by _document enhanceApp during SSR so the app uses the same cache
 * we extract styles from. Null on the client.
 */
export const EmotionCacheContext = createContext<EmotionCache | null>(null);

let clientCache: EmotionCache | null = null;

function getClientCache(): EmotionCache {
  if (!clientCache) clientCache = createEmotionCache();
  return clientCache;
}

/**
 * Provides Emotion cache: server cache from context during SSR, client singleton otherwise.
 * Keeps cache key consistent so MUI class names don't mismatch (css- prefix).
 */
export const EmotionCacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const serverCache = useContext(EmotionCacheContext);
  const cache = useMemo(() => serverCache ?? getClientCache(), [serverCache]);
  return <CacheProvider value={cache}>{children}</CacheProvider>;
};
