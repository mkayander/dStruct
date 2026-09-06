"use client";

import { ApolloProvider, type NormalizedCacheObject } from "@apollo/client";
import React, { type ReactNode, useMemo } from "react";

import { createApolloClient } from "#/graphql/createApolloClient";

type ApolloHydrationProviderProps = {
  initialCache: NormalizedCacheObject | null;
  children: ReactNode;
};

/**
 * Route-scoped Apollo client with server-extracted cache for GraphQL routes
 * (daily, profile). Playground uses tRPC only.
 */
export const ApolloHydrationProvider: React.FC<
  ApolloHydrationProviderProps
> = ({ initialCache, children }) => {
  const client = useMemo(
    () => createApolloClient({ initialState: initialCache ?? undefined }),
    [initialCache],
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
