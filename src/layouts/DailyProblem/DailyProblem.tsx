import React from 'react';
import { Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useQuestionOfTodayQuery } from '@src/graphql/generated';
import { DataSection } from '@src/components';

const q =
    'query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    exampleTestcases\n    categoryTitle\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      paidOnly\n      hasVideoSolution\n      paidOnlyVideo\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    enableTestMode\n    enableDebugger\n    envInfo\n    libraryUrl\n    adminUrl\n    challengeQuestion {\n      id\n      date\n      incompleteChallengeCount\n      streakCount\n      type\n      __typename\n    }\n    __typename\n  }\n}\n';

export const DailyProblem: React.FC = () => {
    const { data, loading, error } = useQuestionOfTodayQuery();
    const { activeDailyCodingChallengeQuestion } = data ?? {};
    const question = activeDailyCodingChallengeQuestion?.question;

    return (
        <DataSection title="Daily Problem" Icon={EventIcon} isLoading={loading}>
            <Box>
                {question && (
                    <div>
                        <pre>{JSON.stringify(question, null, 2)}</pre>
                    </div>
                )}

                <pre>{JSON.stringify(error, null, 2)}</pre>
            </Box>
        </DataSection>
    );
};
