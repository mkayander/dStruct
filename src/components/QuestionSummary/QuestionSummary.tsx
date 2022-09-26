import React from 'react';
import { alpha, Box, CircularProgress, darken, Grid, Paper, Typography, useTheme } from '@mui/material';
import { QuestionDataQueryResult } from '@src/graphql/generated';
import { TopicTag } from '@src/components';
import EventIcon from '@mui/icons-material/Event';
import { HistoryToggleOff } from '@mui/icons-material';
import { BoxProps } from '@mui/material/Box/Box';

interface QuestionSummaryProps extends Exclude<BoxProps, 'position' | 'zIndex'> {
    questionDataQuery: QuestionDataQueryResult;
}

export const QuestionSummary: React.FC<QuestionSummaryProps> = ({ questionDataQuery, ...props }) => {
    const theme = useTheme();

    const question = questionDataQuery.data?.question;

    const difficultyColor = question && theme.palette.question[question.difficulty].main;
    const shadowColor = darken(theme.palette.primary.dark, 0.5);

    return (
        <Box position="relative" zIndex={10} {...props}>
            <Paper
                elevation={12}
                sx={{
                    zIndex: theme.zIndex.mobileStepper,
                    maxWidth: '800px',
                    p: 2,
                    mx: 'auto',
                    marginBottom: 2,
                    background: `linear-gradient(64deg, ${alpha(
                        darken(theme.palette.primary.dark, 0.5),
                        0.1
                    )} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 35%, ${alpha(
                        theme.palette.primary.light,
                        0.5
                    )} 100%)`,
                    backdropFilter: 'blur( 14px )',
                    border: '1px solid rgba( 255, 255, 255, 0.18 )',
                    // boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.dark, 0.37)}`,
                    // boxShadow: `0px 7px 8px -4px rgb(0 0 0 / 20%), 0px 12px 17px 2px rgb(0 0 0 / 14%), 0px 5px 22px 4px rgb(0 0 0 / 12%)`,
                    boxShadow: `0px 7px 8px -4px ${alpha(shadowColor, 0.2)}, 0px 12px 17px 2px ${alpha(
                        shadowColor,
                        0.14
                    )}, 0px 5px 22px 4px ${alpha(shadowColor, 0.12)}`,
                    borderRadius: theme.shape.borderRadius,
                }}
            >
                {questionDataQuery.loading && <CircularProgress />}
                {question && (
                    <>
                        <Typography color={difficultyColor}>{question.difficulty}</Typography>

                        <Grid marginTop={2} container columnSpacing={1}>
                            {question.topicTags.map((topic) => (
                                <Grid item key={topic.slug}>
                                    <TopicTag topic={topic} />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Paper>

            <EventIcon
                sx={{
                    position: 'absolute',
                    zIndex: -1,
                    fontSize: '1300%',
                    color: theme.palette.primary.light,
                    right: '2%',
                    top: 0,
                    transform: 'translateY(-40%) rotate(20deg)',
                }}
            />

            <HistoryToggleOff
                sx={{
                    position: 'absolute',
                    zIndex: -1,
                    fontSize: '190px',
                    // color: theme.palette.success.main,
                    color: theme.palette.error.dark,
                    left: 0,
                    bottom: 0,
                    transform: 'translateY(40%) rotate(0deg)',
                }}
            />
        </Box>
    );
};
