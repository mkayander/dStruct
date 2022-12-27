import {
  Box,
  Container,
  darken,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { RawNodeDatum } from 'react-d3-tree/lib/types/types/common';

const orgChart: RawNodeDatum = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

const PlaygroundPage: NextPage = () => {
  const theme = useTheme();

  const Tree = dynamic(() => import('react-d3-tree'), {
    ssr: false,
  });

  return (
    <>
      <Head>
        <title>LeetPal Playground</title>
      </Head>
      <Container>
        <Typography variant="h3">Playground page</Typography>

        <Box my={3}>
          <Typography>Settings</Typography>
          <TextField label="Input array" placeholder="e.g.: [1,2,3,null,5]" />
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '512px',
            backgroundColor: darken(theme.palette.action.hover, 0.7),
            '.rd3t-label__title': {
              fill: theme.palette.text.primary,
            },
            'rd3t-label__attributes': {
              fill: theme.palette.text.secondary,
            },
            '.rd3t-link': {
              stroke: theme.palette.text.primary,
            },
            '.rd3t-node': {
              stroke: theme.palette.text.disabled,
            },
            '.rd3t-leaf-node': {
              stroke: theme.palette.text.disabled,
            },
          }}
          boxShadow={6}
        >
          <Tree data={orgChart} orientation="vertical" pathFunc="straight" />
        </Box>
      </Container>
    </>
  );
};

export default PlaygroundPage;
