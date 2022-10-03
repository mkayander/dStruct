import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import { Box, Divider, Typography } from '@mui/material';
import { DataSection, QuestionSummary } from '@src/components';
import styles from './DailyProblem.module.scss';
import { DailyQuestionDataQuery } from '@src/api/useDailyQuestionData';

interface DailyProblemProps {
    questionDataQuery: DailyQuestionDataQuery;
}

export const DailyProblem: React.FC<DailyProblemProps> = ({ questionDataQuery }) => {
    const question = questionDataQuery.query.data?.question;

    const sanitizedContent = useMemo(
        () =>
            question &&
            sanitizeHtml(question.content, {
                allowedTags: ['img', 'p', 'strong', 'ul', 'li', 'pre', 'code'],
            }),
        [question]
    );

    const loading = questionDataQuery.query.loading;

    if (question) console.info('Question of today:', question);

    return (
        <DataSection title={question?.title || 'Daily Problem'} caption="📅 Question Of Today" isLoading={loading}>
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
