import { useQuestionDataQuery, useQuestionOfTodayQuery } from '#/graphql/generated';

export const useDailyQuestionData = (
    options?: Exclude<Parameters<typeof useQuestionDataQuery>, 'variables' | 'skip'>
) => {
    const questionOfTodayQuery = useQuestionOfTodayQuery();
    const { activeDailyCodingChallengeQuestion } = questionOfTodayQuery.data ?? {};
    const titleSlug = activeDailyCodingChallengeQuestion?.question.titleSlug;

    return useQuestionDataQuery({ variables: { titleSlug: titleSlug || '' }, skip: !titleSlug, ...options });
};
