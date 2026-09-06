import { createApolloClient } from "#/graphql/createApolloClient";

/** Browser singleton — daily/profile routes hydrate via {@link ApolloHydrationProvider}. */
export const apolloClient = createApolloClient();
