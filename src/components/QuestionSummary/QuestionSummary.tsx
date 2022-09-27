import React from 'react';
import { alpha, Box, CircularProgress, darken, Grid, Paper, SvgIcon, Typography, useTheme } from '@mui/material';
import { Difficulty, QuestionDataQueryResult } from '@src/graphql/generated';
import { CircularPercentage, TopicTag } from '@src/components';
import EventIcon from '@mui/icons-material/Event';
import {
    EventRepeatTwoTone,
    HistoryToggleOff,
    SignalCellular0Bar,
    SignalCellular2Bar,
    SignalCellular4Bar,
} from '@mui/icons-material';
import { BoxProps } from '@mui/material/Box/Box';

const DifficultyIconMap: Record<keyof typeof Difficulty, typeof SvgIcon> = {
    All: SignalCellular0Bar,
    Easy: SignalCellular0Bar,
    Medium: SignalCellular2Bar,
    Hard: SignalCellular4Bar,
};

interface QuestionSummaryProps extends Exclude<BoxProps, 'position' | 'zIndex'> {
    questionDataQuery: QuestionDataQueryResult;
}

export const QuestionSummary: React.FC<QuestionSummaryProps> = ({ questionDataQuery, ...props }) => {
    const theme = useTheme();

    const question = questionDataQuery.data?.question;

    const difficultyColor = question && theme.palette.question[question.difficulty].main;
    const DifficultyIcon = question && DifficultyIconMap[question.difficulty];
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
                    <Box display="flex" justifyContent="space-between">
                        <div>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="h4" lineHeight={0.8}>
                                    {question.title}
                                </Typography>
                                <Box display="flex" sx={{ opacity: 0.9 }}>
                                    <EventRepeatTwoTone sx={{ mx: 1 }} />
                                    <Typography variant="subtitle1">Question Of Today</Typography>
                                </Box>
                            </Box>
                            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                                {question.categoryTitle}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    my: 1,
                                    color: difficultyColor,
                                    svg: {
                                        marginRight: 1,
                                    },
                                }}
                            >
                                {DifficultyIcon && <DifficultyIcon />}
                                <Typography>{question.difficulty}</Typography>
                            </Box>

                            <Grid marginTop={2} container columnSpacing={1}>
                                {question.topicTags.map((topic) => (
                                    <Grid item key={topic.slug}>
                                        <TopicTag topic={topic} />
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <CircularPercentage value={55} />
                        </Box>
                    </Box>
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
