import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';

export default function Document() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h1">Landing page</Typography>
      <Divider />
      <br />
      <Link href={'/dashboard'}>Dashboard</Link>
    </Box>
  );
}
