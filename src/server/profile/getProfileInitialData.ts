import type { NormalizedCacheObject } from "@apollo/client";

import { createApolloClient } from "#/graphql/createApolloClient";
import { GetUserProfileDocument } from "#/graphql/generated";

/**
 * Prefetch LeetCode profile stats when the user has linked a LeetCode account.
 * Returns null when username or session cookie is missing.
 */
export async function getProfileInitialData(
  leetCodeUsername: string | null | undefined,
  leetCodeSession: string | null | undefined,
): Promise<NormalizedCacheObject | null> {
  const username = leetCodeUsername?.trim();
  if (!username) {
    return null;
  }

  const client = createApolloClient({
    ssr: true,
    leetCodeSession: leetCodeSession ?? null,
  });

  try {
    await client.query({
      query: GetUserProfileDocument,
      variables: { username },
      fetchPolicy: "no-cache",
    });

    return client.cache.extract();
  } catch (error) {
    console.warn(
      "getProfileInitialData: LeetCode GraphQL prefetch failed",
      error,
    );
    return null;
  }
}
