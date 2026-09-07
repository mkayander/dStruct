import { createApolloClient } from "#/graphql/createApolloClient";
import { QuestionTitleDocument } from "#/graphql/generated";
import type { Difficulty } from "#/graphql/generated";

export type LeetCodeQuestionMetadata = {
  title: string;
  titleSlug: string;
  difficulty: Difficulty;
};

/**
 * Fetch public LeetCode question metadata for project import (server-side).
 */
export async function fetchLeetCodeQuestionMetadata(
  titleSlug: string,
): Promise<LeetCodeQuestionMetadata | null> {
  const client = createApolloClient({ ssr: true });

  try {
    const result = await client.query({
      query: QuestionTitleDocument,
      variables: { titleSlug },
      fetchPolicy: "no-cache",
    });

    const question = result.data.question;
    if (!question?.title || !question.titleSlug || !question.difficulty) {
      return null;
    }

    return {
      title: question.title,
      titleSlug: question.titleSlug,
      difficulty: question.difficulty,
    };
  } catch (error) {
    console.warn(
      "fetchLeetCodeQuestionMetadata: LeetCode GraphQL request failed",
      error,
    );
    return null;
  }
}
