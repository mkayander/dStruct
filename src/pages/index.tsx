import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import { MainLayout } from '#/layouts';

export default function Document() {
  return (
      <MainLayout>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Typography variant="h1">Landing page</Typography>
          <Divider />
          <br />
          <Link href={'/dashboard'}>Dashboard</Link>
        </Box>
      </MainLayout>
  );
}
