import type { NormalizedCacheObject } from "@apollo/client";

import { createApolloClient } from "#/graphql/createApolloClient";
import {
  QuestionDataDocument,
  QuestionOfTodayDocument,
} from "#/graphql/generated";

/**
 * Prefetch today's LeetCode daily question for RSC + Apollo cache hydration.
 * Returns null when upstream GraphQL is unavailable (client hooks refetch).
 */
export async function getDailyInitialData(): Promise<NormalizedCacheObject | null> {
  const client = createApolloClient({ ssr: true });

  try {
    const todayResult = await client.query({
      query: QuestionOfTodayDocument,
      fetchPolicy: "no-cache",
    });

    const titleSlug =
      todayResult.data.activeDailyCodingChallengeQuestion?.question?.titleSlug;

    if (titleSlug) {
      await client.query({
        query: QuestionDataDocument,
        variables: { titleSlug },
        fetchPolicy: "no-cache",
      });
    }

    return client.cache.extract();
  } catch (error) {
    console.warn(
      "getDailyInitialData: LeetCode GraphQL prefetch failed",
      error,
    );
    return null;
  }
}
