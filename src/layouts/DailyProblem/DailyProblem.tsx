import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import { alpha, Box, Divider } from '@mui/material';
import { DataSection, QuestionSummary } from '@src/components';
import styles from './DailyProblem.module.scss';
import theme from '@src/theme';
import { QuestionDataQueryResult } from '@src/graphql/generated';

interface DailyProblemProps {
    questionDataQuery: QuestionDataQueryResult;
}

export const DailyProblem: React.FC<DailyProblemProps> = ({ questionDataQuery }) => {
    const question = questionDataQuery.data?.question;

    const sanitizedContent = useMemo(
        () =>
            question &&
            sanitizeHtml(question.content, {
                allowedTags: ['img', 'p', 'strong', 'ul', 'li', 'pre', 'code'],
            }),
        [question]
    );

    const loading = questionDataQuery.loading;

    if (question) console.info('Question of today:', question);

    return (
        <DataSection title={question?.title || 'Daily Problem'} caption="📅 Question Of Today" isLoading={loading}>
            {question && (
                <Box>
                    <QuestionSummary questionDataQuery={questionDataQuery} marginBottom={10} />
                    <Divider />
                    <Box
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: sanitizedContent ?? '' }}
                        sx={{
                            img: {
                                borderRadius: theme.shape.borderRadius,
                            },
                            pre: {
                                my: 1,
                                borderRadius: theme.shape.borderRadius,
                                background: alpha(theme.palette.primary.dark, 0.1),
                            },
                        }}
                    />
                    <Divider />
                </Box>
            )}
        </DataSection>
    );
};
