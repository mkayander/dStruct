import { Box, LinearProgress } from '@mui/material';
import React from 'react';

import { Footer, MainAppBar } from '#/components';

interface MainLayoutProps {
  children: React.ReactNode;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isLoading,
  setDarkMode,
}) => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <MainAppBar setDarkMode={setDarkMode} />
      <Box sx={{ minHeight: '85vh' }}>
        {isLoading ? <LinearProgress variant="indeterminate" /> : children}
      </Box>
      <Footer />
    </Box>
  );
};
