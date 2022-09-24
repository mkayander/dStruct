import React from 'react';
import { DailyProblem, LeetCodeStats, MainLayout, UserSettings } from '@src/layouts';
import { Container } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useGetUserProfileQuery } from '@src/graphql/generated';

export default function DashboardPage() {
    const session = useSession();
    const leetCodeUsername = session.data?.user.leetCodeUsername;

    const userProfileQueryResult = useGetUserProfileQuery({
        variables: {
            username: leetCodeUsername || '',
        },
        skip: !leetCodeUsername,
    });

    return (
        <MainLayout>
            <Container>
                <h1>Dashboard</h1>
                <UserSettings />
                <LeetCodeStats userProfile={userProfileQueryResult} />
                <DailyProblem />
            </Container>
        </MainLayout>
    );
}
