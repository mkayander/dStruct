import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { DataSection } from '@src/layouts';
import { Code } from '@mui/icons-material';
import { Difficulty, GetUserProfileQueryResult } from '@src/graphql/generated';

const titlesMap: Record<keyof typeof Difficulty, string> = {
    All: 'Total Questions Solved',
    Easy: 'Easy Questions Solved',
    Medium: 'Medium Questions Solved',
    Hard: 'Hard Questions Solved',
};

interface LeetCodeStatsProps {
    userProfile: GetUserProfileQueryResult;
}

export const LeetCodeStats: React.FC<LeetCodeStatsProps> = ({ userProfile }) => {
    const matchedUser = userProfile?.data?.matchedUser;

    const theme = useTheme();

    if (!matchedUser) return null;

    console.log(userProfile.data);

    return (
        <DataSection title={'LeetCode Stats'} Icon={Code}>
            <Box
                sx={{
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    justifyContent: 'space-between',
                }}
            >
                <Grid container spacing={1}>
                    <Grid className="row" container item spacing={1}>
                        <Grid item xs={5}>
                            <Typography fontWeight="bold">Ranking:</Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography>{matchedUser?.profile.ranking}</Typography>
                        </Grid>
                    </Grid>
                    {matchedUser.submitStats.totalSubmissionNum?.map((item) => (
                        <Grid key={item.difficulty} wrap="nowrap" className="row" container item spacing={1}>
                            <Grid item xs={5}>
                                <Typography fontWeight="bold">{titlesMap[item.difficulty]}:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>
                                    {item.count} /{' '}
                                    {
                                        userProfile.data?.allQuestionsCount.find(
                                            (all) => all.difficulty === item.difficulty
                                        )?.count
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            background: theme.palette.secondary.dark,
                            height: '180px',
                            width: '180px',
                            borderRadius: '50%',
                        }}
                    >
                        <Typography
                            sx={{
                                width: 'fit-content',
                            }}
                        >
                            Circle
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </DataSection>
    );
};
