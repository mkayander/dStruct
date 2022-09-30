import {
    Question,
    QuestionDataQueryResult,
    useQuestionDataQuery,
    useQuestionOfTodayQuery,
} from '@src/graphql/generated';
import { useMemo } from 'react';

export type QuestionStats = {
    acRate: number;
    totalAccepted: string;
    totalAcceptedRaw: number;
    totalSubmission: string;
    totalSubmissionRaw: number;
};

export type SimilarQuestions = Pick<Question, 'difficulty' | 'title' | 'titleSlug' | 'translatedTitle'>;

export interface DailyQuestionDataQuery {
    query: QuestionDataQueryResult;
    stats?: QuestionStats;
    similarQuestions?: SimilarQuestions;
}

export const useDailyQuestionData = (
    options?: Exclude<Parameters<typeof useQuestionDataQuery>, 'variables' | 'skip'>
): DailyQuestionDataQuery => {
    const questionOfTodayQuery = useQuestionOfTodayQuery();
    const { activeDailyCodingChallengeQuestion } = questionOfTodayQuery.data ?? {};
    const titleSlug = activeDailyCodingChallengeQuestion?.question.titleSlug;

    const query = useQuestionDataQuery({ variables: { titleSlug: titleSlug || '' }, skip: !titleSlug, ...options });

    return useMemo(
        () => {
            const stats = query.data?.question.stats && JSON.parse(query.data?.question.stats);
            stats && (stats.acRate = parseFloat(stats.acRate));

            return {
                query,
                stats,
                similarQuestions:
                    query.data?.question.similarQuestions && JSON.parse(query.data?.question.similarQuestions),
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [query.data]
    );
};
