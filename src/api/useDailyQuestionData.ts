import {
  useQuestionDataQuery,
  useQuestionOfTodayQuery,
} from "#/graphql/generated";

export const useDailyQuestionData = (
  options?: Exclude<
    Parameters<typeof useQuestionDataQuery>,
    "variables" | "skip"
  >,
) => {
  const questionOfTodayQuery = useQuestionOfTodayQuery();
  const { activeDailyCodingChallengeQuestion } =
    questionOfTodayQuery.data ?? {};
  const titleSlug = activeDailyCodingChallengeQuestion?.question.titleSlug;

  const questionDataQuery = useQuestionDataQuery({
    variables: { titleSlug: titleSlug || "" },
    skip: !titleSlug,
    ...options,
  });

  // Surface failures from either step (today slug fetch or detail query)—avoid silent empty state.
  const error = questionOfTodayQuery.error ?? questionDataQuery.error;

  return {
    ...questionDataQuery,
    error,
  };
};
