import React, { useMemo } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { DataSection } from '@src/layouts';
import { Code } from '@mui/icons-material';
import { Difficulty, GetUserProfileQueryResult, QuestionCount, SubmissionNum } from '@src/graphql/generated';

type SubmissionsData = {
    allQuestionsCount: Record<keyof typeof Difficulty, QuestionCount>;
    acSubmissionNum: Record<keyof typeof Difficulty, SubmissionNum>;
};

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

    const submissionsData = useMemo<SubmissionsData | null>(() => {
        if (!userProfile.data) return null;

        const mapItems = (item: QuestionCount | SubmissionNum) => [item.difficulty, item];
        const obj = {
            allQuestionsCount: Object.fromEntries(userProfile.data.allQuestionsCount.map(mapItems)),
            acSubmissionNum: Object.fromEntries(userProfile.data.matchedUser.submitStats.acSubmissionNum.map(mapItems)),
        };

        console.log('useMemo: ', obj);

        return obj;
    }, [userProfile.data]);

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
                            <Typography>{matchedUser?.profile.ranking?.toLocaleString()}</Typography>
                        </Grid>
                    </Grid>
                    {matchedUser.submitStats.acSubmissionNum?.map((item) => (
                        <Grid key={item.difficulty} wrap="nowrap" className="row" container item spacing={1}>
                            <Grid item xs={5}>
                                <Typography fontWeight="bold">{titlesMap[item.difficulty]}:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>
                                    <span>{item.count}</span> /{' '}
                                    <Typography variant="body2" fontWeight="lighter" component="span">
                                        {submissionsData?.allQuestionsCount[item.difficulty]?.count}
                                    </Typography>
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
                        {submissionsData && (
                            <div>
                                <Typography textAlign="center">{submissionsData.acSubmissionNum.All.count}</Typography>
                                <Typography>
                                    {(
                                        (submissionsData.acSubmissionNum.All.count /
                                            submissionsData.allQuestionsCount.All.count) *
                                        100
                                    ).toFixed(2)}
                                    %
                                </Typography>
                            </div>
                        )}
                    </Box>
                </Box>
            </Box>
        </DataSection>
    );
};
