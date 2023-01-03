import { Refresh } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import * as util from 'util';

import { BinaryNode } from '#/components';
import { useBinaryTree, useDebounce } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';

const PlaygroundPage: NextPage = () => {
  // const theme = useTheme();

  const [rawInput, setRawInput] = useState<string>('');
  const { value: input, isPending } = useDebounce(rawInput, 500);

  const parsedInput = useMemo<BinaryTreeInput | undefined>(() => {
    try {
      return JSON.parse(input);
    } catch (e) {
      return undefined;
    }
  }, [input]);

  const tree = useBinaryTree(parsedInput);

  return (
    <>
      <Head>
        <title>LeetPal Playground</title>
      </Head>
      <Container>
        <Typography variant="h3">Playground page</Typography>

        <Box
          my={3}
          sx={{
            display: 'flex',
            flexFlow: 'column nowrap',
            gap: 2,
            maxWidth: '512px',
          }}
        >
          <Typography>Settings</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Input array"
              placeholder="e.g.: [1,2,3,null,5]"
              value={rawInput}
              onChange={(ev) => setRawInput(ev.target.value)}
            />
            <IconButton
              onClick={() => setRawInput('[1,2,3,null,5]')}
              title="Reset input to default"
            >
              <Refresh />
            </IconButton>
            {isPending && <CircularProgress />}
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          rowGap={1}
          p={3}
          boxShadow={6}
        >
          <pre>{JSON.stringify(parsedInput)}</pre>
          <Collapse in={true}>
            <pre>
              {util.inspect(tree, {
                showHidden: true,
                depth: null,
              })}
            </pre>
          </Collapse>
          {tree && <BinaryNode {...tree} />}
        </Box>
      </Container>
    </>
  );
};

export default PlaygroundPage;
