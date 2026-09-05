"use client";

import { ApolloProvider } from "@apollo/client";
import React, { type ReactNode } from "react";

import { apolloClient } from "#/graphql/apolloClient";

/**
 * Apollo GraphQL for routes that use generated hooks (daily, profile).
 * tRPC stays in {@link AppShellProviders} because MainAppBar uses it globally.
 */
export const InteractiveDataProviders: React.FC<{ children: ReactNode }> = ({
  children,
}) => <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
