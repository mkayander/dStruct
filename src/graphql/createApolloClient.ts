import {
  ApolloClient,
  createHttpLink,
  type NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getCookie } from "cookies-next";

import { createApolloInMemoryCache } from "#/graphql/apolloInMemoryCache";

export type CreateApolloClientOptions = {
  initialState?: NormalizedCacheObject;
  /** Server-side fetch against LeetCode directly (no browser cookies). */
  ssr?: boolean;
  leetCodeSession?: string | null;
};

export function createApolloClient(
  options?: CreateApolloClientOptions,
): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink({
    uri: options?.ssr ? "https://leetcode.com/graphql/" : "/api/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const token = options?.ssr
      ? options.leetCodeSession
      : getCookie("LEETCODE_SESSION");

    return {
      headers: {
        ...headers,
        ...(options?.ssr && token
          ? { cookie: `LEETCODE_SESSION=${token}` }
          : {}),
        ...(!options?.ssr && token ? { extToken: token } : {}),
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: createApolloInMemoryCache(),
    devtools: { enabled: process.env.NODE_ENV !== "production" },
  });

  if (options?.initialState) {
    client.cache.restore(options.initialState);
  }

  return client;
}
