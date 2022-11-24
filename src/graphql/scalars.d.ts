import type { Question } from '@src/graphql/generated';

namespace Scalars {
    export type QuestionStats = {
        acRate: number;
        totalAccepted: string;
        totalAcceptedRaw: number;
        totalSubmission: string;
        totalSubmissionRaw: number;
    };

    export type SimilarQuestions = Pick<Question, 'difficulty' | 'title' | 'titleSlug' | 'translatedTitle'>;

    export type EnvInfo = Record<string, [string, string]>;

    export type MetaData = {
        name: string;
        params: Array<{ name: string; type: string }>;
        return: {
            type: string;
        };
    };
}

export default Scalars;
