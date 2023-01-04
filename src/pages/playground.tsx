import {
  AccountTree,
  ExpandLess,
  ExpandMore,
  Refresh,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { ArcherContainer } from 'react-archer';
import * as util from 'util';

import { BinaryNode } from '#/components';
import { useBinaryTree, useDebounce } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';

const PlaygroundPage: NextPage = () => {
  const theme = useTheme();

  const [rawInput, setRawInput] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);
  const { value: input, isPending } = useDebounce(rawInput, 500);

  const parsedInput = useMemo<BinaryTreeInput | undefined>(() => {
    if (input === '') {
      setInputError(null);
      return undefined;
    }

    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        setInputError(null);
        return parsed;
      } else {
        setInputError(`Input must be an array, but got ${typeof parsed}`);
        return undefined;
      }
    } catch (e: any) {
      setInputError(e.message);
      return undefined;
    }
  }, [input]);

  const tree = useBinaryTree(parsedInput);

  const [isJsonOpened, setIsJsonOpened] = useState<boolean>(false);
  const treeJson = useMemo<string>(
    () => util.inspect(tree, { depth: null }),
    [tree]
  );

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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              gap: 2,
              'button.btn-refresh': { mt: 1 },
            }}
          >
            <TextField
              label="Input array"
              placeholder="e.g.: [1,2,3,null,5]"
              value={rawInput}
              onChange={(ev) => setRawInput(ev.target.value)}
              error={!!inputError}
              helperText={inputError || 'Must be a JSON array of numbers'}
              fullWidth
            />
            <IconButton
              className="btn-refresh"
              onClick={() => setRawInput('[1,2,3,null,5]')}
              title="Reset input to default"
              disabled={isPending}
            >
              <Refresh />
            </IconButton>
            {isPending && <CircularProgress />}
          </Box>
        </Box>

        <ListItemButton onClick={() => setIsJsonOpened(!isJsonOpened)}>
          <ListItemIcon>
            <AccountTree />
          </ListItemIcon>
          <ListItemText primary="Generated tree object" />
          {isJsonOpened ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isJsonOpened}>
          <pre>{treeJson}</pre>
        </Collapse>

        <Box
          display="flex"
          flexDirection="column"
          rowGap={1}
          p={3}
          my={1}
          boxShadow={6}
        >
          <ArcherContainer
            lineStyle="straight"
            strokeColor={alpha(theme.palette.primary.dark, 0.5)}
            strokeWidth={4}
            endMarker={false}
          >
            {tree && <BinaryNode {...tree} />}
          </ArcherContainer>
        </Box>
      </Container>
    </>
  );
};

export default PlaygroundPage;
