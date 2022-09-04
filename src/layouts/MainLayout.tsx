import React from 'react';
import { Footer, MainAppBar } from '@src/components';
import { Box } from '@mui/material';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <MainAppBar />
            <Box sx={{ minHeight: '85vh' }}>{children}</Box>
            <Footer />
        </Box>
    );
};
