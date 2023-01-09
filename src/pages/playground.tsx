import {
  AccountTree,
  ExpandLess,
  ExpandMore,
  Refresh,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import { ArcherContainer } from 'react-archer';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useSelector } from 'react-redux';

import { BinaryNode, CodeRunner } from '#/components';
import { useBinaryTree, useDebounce } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';

import { useAppDispatch, useAppSelector } from '#/store/hooks';
import {
  selectAllNodeData,
  selectNodeDataById,
  treeNodeSlice,
} from '#/store/reducers/treeNodeReducer';

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
  const treeJson = useMemo<string>(() => JSON.stringify(tree, null, 2), [tree]);

  const dispatch = useAppDispatch();

  const nodes = useAppSelector(selectAllNodeData);

  const [selectValue, setSelectValue] = useState<string>('');
  const selectedNode = useSelector(selectNodeDataById(selectValue));

  const [colorInput, setColorInput] = useState<string>('');

  const handleSetColor = () => {
    console.log('Set color:\n', colorInput);

    if (!selectedNode) return;

    dispatch(
      treeNodeSlice.actions.update({
        ...selectedNode,
        color: colorInput,
      })
    );
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
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1} my={3}>
          <FormControl sx={{ minWidth: 256 }}>
            <InputLabel id="select-node-label">Select node</InputLabel>
            <Select
              labelId="select-node-label"
              label="Select node"
              value={selectValue}
              onChange={(event) => setSelectValue(event.target.value)}
            >
              {nodes?.map((node) => (
                <MenuItem key={node.id} value={node.id}>
                  {node.id} {node.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Node color"
            placeholder="Enter color"
            value={colorInput}
            onChange={(event) => setColorInput(event.target.value)}
          />
          <Button variant="text" onClick={handleSetColor}>
            Set Color
          </Button>
        </Box>
        <CodeRunner tree={tree} />
      </Container>
    </>
  );
};

export default PlaygroundPage;
