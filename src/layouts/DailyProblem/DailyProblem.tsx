import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import { Box, Divider, Typography } from '@mui/material';
import { QuestionDataQueryResult } from '@src/graphql/generated';
import { DataSection, QuestionSummary } from '@src/components';
import styles from './DailyProblem.module.scss';

interface DailyProblemProps {
    questionDataQuery: QuestionDataQueryResult;
}

export const DailyProblem: React.FC<DailyProblemProps> = ({ questionDataQuery }) => {
    const question = questionDataQuery.data?.question;

    const sanitizedContent = useMemo(() => question && sanitizeHtml(question.content), [question]);

    const loading = questionDataQuery.loading;

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
