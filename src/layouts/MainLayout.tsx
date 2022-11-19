import React from 'react';
import { Footer, MainAppBar } from '#/components';
import { Box, LinearProgress } from '@mui/material';

interface MainLayoutProps {
    children: React.ReactNode;
    isLoading?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, isLoading }) => {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <MainAppBar />
            <Box sx={{ minHeight: '85vh' }}>{isLoading ? <LinearProgress variant="indeterminate" /> : children}</Box>
            <Footer />
        </Box>
    );
};
