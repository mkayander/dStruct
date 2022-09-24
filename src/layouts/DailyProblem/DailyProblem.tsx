import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import { Box, Divider, Grid, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useQuestionDataQuery, useQuestionOfTodayQuery } from '@src/graphql/generated';
import { DataSection, TopicTag } from '@src/components';
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
        <DataSection title="Daily Problem" Icon={EventIcon} isLoading={loading}>
            <Box>
                {question && (
                    <div>
                        <Typography>{question.title}</Typography>
                        <Typography>{question.titleSlug}</Typography>
                        <Typography>{question.difficulty}</Typography>

                        <Grid my={2} container columnSpacing={1}>
                            {question.topicTags.map((topic) => (
                                <Grid item key={topic.slug}>
                                    <TopicTag topic={topic} />
                                </Grid>
                            ))}
                        </Grid>

                        <Divider />
                        <Typography
                            className={styles.content}
                            component="div"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent ?? '' }}
                        ></Typography>
                        <Divider />
                    </div>
                )}
            </Box>
        </DataSection>
    );
};
