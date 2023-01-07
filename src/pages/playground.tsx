import {
  AccountTree,
  DeleteForever,
  ExpandLess,
  ExpandMore,
  PlayArrow,
  Refresh,
  Save,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
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
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useMemo, useState } from 'react';
import { ArcherContainer } from 'react-archer';
import ScrollContainer from 'react-indiana-drag-scroll';

import { BinaryNode, CodeEditor } from '#/components';
import { defaultJsTemplate } from '#/components/CodeEditor/CodeEditor';
import { useBinaryTree, useDebounce } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <CircularProgress />,
});

const PlaygroundPage: NextPage = () => {
  const theme = useTheme();

  const [rawInput, setRawInput] = useState<string>('[1,2,3,null,5]');
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
    () =>
      JSON.stringify(
        tree,
        (key, value) => {
          if (key === 'rootNode') return undefined;
          return value;
        },
        2
      ),
    [tree]
  );

  useEffect(() => {
    const savedCode = localStorage.getItem('code');
    if (savedCode) setCodeInput(savedCode);
  }, []);

  const [codeInput, setCodeInput] = useState<string>(defaultJsTemplate);
  const [codeResult, setCodeResult] = useState<string | null>(null);

  const handleClearCode = () => {
    setCodeInput(defaultJsTemplate);
    localStorage.removeItem('code');
  };

  const handleSaveCode = () => {
    localStorage.setItem('code', codeInput);
    console.log('Saved code to localStorage:\n', codeInput);
  };

  const handleRunCode = () => {
    console.log('Run code:\n', codeInput);

    const getInputFunction = new Function(codeInput);

    try {
      const runFunction = getInputFunction();
      console.log('Run function:\n', runFunction);

      const result = runFunction(tree);

      console.log('Result:\n', result);

      setCodeResult(result);
    } catch (e: any) {
      console.error(e);
    }
  };

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
          <MonacoEditor
            height="80vh"
            theme="vs-dark"
            language="json"
            value={treeJson}
            defaultValue="Loading..."
            options={{
              readOnly: true,
              minimap: {
                enabled: true,
              },
            }}
          />
        </Collapse>

        <Box
          display="flex"
          flexDirection="column"
          rowGap={1}
          my={1}
          boxShadow={6}
          borderRadius={1}
        >
          <ScrollContainer>
            <Box sx={{ m: 3 }}>
              <ArcherContainer
                lineStyle="straight"
                strokeColor={alpha(theme.palette.primary.dark, 0.5)}
                strokeWidth={4}
                endMarker={false}
                svgContainerStyle={{ overflow: 'visible' }}
              >
                {tree && <BinaryNode {...tree} />}
              </ArcherContainer>
            </Box>
          </ScrollContainer>
        </Box>
        <Box display="flex" justifyContent="space-between" my={2}>
          <Box display="flex" alignItems="center" columnGap={2}>
            <Typography variant="h5">
              Code Runner {'< '}
              <Box
                component="span"
                fontWeight="bold"
                color={theme.palette.warning.light}
              >
                JS
              </Box>
              {' />'}
            </Typography>
            <Typography variant="body1">Result: </Typography>
            <Typography variant="body1" color="primary">
              {String(codeResult)}
            </Typography>
          </Box>
          <Box display="flex" columnGap={2}>
            <LoadingButton
              variant="outlined"
              color="warning"
              size="small"
              endIcon={<DeleteForever />}
              onClick={handleClearCode}
            >
              Clear
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              color="info"
              size="small"
              endIcon={<Save />}
              onClick={handleSaveCode}
            >
              Save
            </LoadingButton>
            <LoadingButton
              loadingPosition="end"
              variant="outlined"
              color="success"
              size="small"
              endIcon={<PlayArrow />}
              onClick={handleRunCode}
            >
              Run Code
            </LoadingButton>
          </Box>
        </Box>
        <Box boxShadow={8} borderRadius={1} overflow="hidden">
          <CodeEditor
            height="80vh"
            theme="vs-dark"
            language="javascript"
            value={codeInput}
            onChange={(value) => setCodeInput(value || '')}
          />
        </Box>
      </Container>
    </>
  );
};

export default PlaygroundPage;
