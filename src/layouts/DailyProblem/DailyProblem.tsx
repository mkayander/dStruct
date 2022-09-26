import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import { Box, Divider, Typography } from '@mui/material';
import { useQuestionDataQuery, useQuestionOfTodayQuery } from '@src/graphql/generated';
import { DataSection, QuestionSummary } from '@src/components';
import styles from './DailyProblem.module.scss';

export const DailyProblem: React.FC = () => {
    const questionOfTodayQuery = useQuestionOfTodayQuery();
    const { activeDailyCodingChallengeQuestion } = questionOfTodayQuery.data ?? {};
    const titleSlug = activeDailyCodingChallengeQuestion?.question.titleSlug;
    const questionDataQuery = useQuestionDataQuery({ variables: { titleSlug: titleSlug || '' }, skip: !titleSlug });

    const question = questionDataQuery.data?.question;

    const sanitizedContent = useMemo(() => question && sanitizeHtml(question.content), [question]);

    const loading = questionOfTodayQuery.loading || questionDataQuery.loading;

    if (question) console.info('Question of today:', question);

    return (
        <DataSection
            title={question?.title || 'Daily Problem'}
            // Icon={EventIcon}
            caption="📅 Question Of Today"
            isLoading={loading}
        >
            {question && (
                <Box>
                    <QuestionSummary questionDataQuery={questionDataQuery} marginBottom={10} />
                    <Divider />
                    <Typography
                        className={styles.content}
                        component="div"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent ?? '' }}
                    ></Typography>
                    <Divider />
                </Box>
            )}
        </DataSection>
    );
};
