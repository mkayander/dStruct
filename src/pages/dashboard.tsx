import React from 'react';
import { LeetCodeStats, MainLayout, UserSettings } from '@src/layouts';
import { Container } from '@mui/material';

export default function DashboardPage() {
    return (
        <MainLayout>
            <Container>
                <h1>Dashboard</h1>
                <UserSettings />
                <LeetCodeStats />
            </Container>
        </MainLayout>
    );
}
