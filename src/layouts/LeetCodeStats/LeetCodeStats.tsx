import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Code } from '@mui/icons-material';
import { Difficulty, GetUserProfileQueryResult, QuestionCount, SubmissionNum } from '#/graphql/generated';
import { CircularPercentage, DataSection } from '#/components';

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
                    {matchedUser?.submitStats.acSubmissionNum?.map((item) => (
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
                    <CircularPercentage
                        value={
                            (submissionsData &&
                                (submissionsData.acSubmissionNum.All.count /
                                    submissionsData.allQuestionsCount.All.count) *
                                    100) ||
                            0
                        }
                    />
                </Box>
            </Box>
        </DataSection>
    );
};
