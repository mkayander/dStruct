import type { EditorProps } from '@monaco-editor/react';
import {
  AutoFixHigh,
  DeleteForever,
  PlayArrow,
  Save,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import dynamic from 'next/dynamic';
import parserBabel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import React, { useEffect, useState } from 'react';

import type { BinaryTreeNode } from '#/hooks/dataTypes/binaryTreeNode';

import { useAppDispatch } from '#/store/hooks';
import { callstackSlice } from '#/store/reducers/callstackReducer';
import { treeNodeSlice } from '#/store/reducers/treeNodeReducer';

import defaultJsTemplate from './defaultTemplate.js.txt';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <CircularProgress />,
});

type CodeRunnerProps = EditorProps & {
  tree: BinaryTreeNode | null;
};

export const CodeRunner: React.FC<CodeRunnerProps> = ({
  tree,
  ...restProps
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedCode = localStorage.getItem('code');
    if (savedCode) setCodeInput(savedCode);
  }, []);

  const [codeInput, setCodeInput] = useState<string>(defaultJsTemplate);

  const [codeResult, setCodeResult] = useState<string | null>(null);

  const [error, setError] = useState<Error | null>(null);

  const handleFormatCode = () => {
    const formattedCode = prettier.format(codeInput, {
      parser: 'babel',
      plugins: [parserBabel],
    });
    setCodeInput(formattedCode);
  };

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

      // Before running the code, clear the callstack
      dispatch(callstackSlice.actions.removeAll());
      dispatch(treeNodeSlice.actions.resetAll()); // Reset all nodes to default

      console.time('Run code');
      const result = runFunction(tree);
      console.timeEnd('Run code');

      // Identify that the callstack is filled and can now be used
      dispatch(callstackSlice.actions.setStatus({ isReady: true }));

      console.log('Result:\n', result);
      setError(null);

      setCodeResult(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e);
      } else {
        console.error('Invalid error type: ', e);
      }
    }
  };

  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(
    null
  );
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>();

  useEffect(() => {
    if (!monacoInstance || !textModel) return;
    if (!error) {
      monacoInstance.editor.setModelMarkers(
        textModel,
        'javascript',
        [] // clear markers
      );
      return;
    }

    let startLineNumber = 3;
    let endLineNumber = 9;
    let startColumn = 1;
    let endColumn = 10;

    console.error(error.stack);
    const [, posLine] = error.stack?.split('\n') ?? [];

    if (posLine) {
      const [, line, column] = posLine.match(/:(\d+):(\d+)\)$/) ?? [];

      if (line && column) {
        startLineNumber = Number(line) - 2;
        endLineNumber = Number(line) - 2;
        startColumn = Number(column);
        endColumn = Number(column) + 10;
      }
    }

    const markers = monacoInstance.editor.getModelMarkers({
      owner: 'error',
      resource: textModel.uri,
    });
    console.log({ markers });
    monacoInstance.editor.setModelMarkers(textModel, 'javascript', [
      {
        severity: monacoInstance.MarkerSeverity.Error,
        message: `${error.name}: ${error.message}`,
        startLineNumber,
        endLineNumber,
        startColumn,
        endColumn,
      },
    ]);
  }, [error, monacoInstance, textModel]);

  return (
    <div>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        my={2}
        gap={1}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">Result: </Typography>
          <Typography variant="body1" color="primary">
            {String(codeResult)}
          </Typography>
        </Box>
        <Box display="flex" columnGap={2}>
          <Tooltip
            title={
              <span>
                Format code with <b>Prettier</b> 🪄
              </span>
            }
            arrow
          >
            <IconButton onClick={handleFormatCode} size="small">
              <AutoFixHigh fontSize="small" />
            </IconButton>
          </Tooltip>
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
        <MonacoEditor
          height="400px"
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'vs-light'}
          options={{
            minimap: { enabled: false },
          }}
          {...restProps}
          language="javascript"
          value={codeInput}
          onChange={(value) => setCodeInput(value || '')}
          onValidate={(markers) => {
            console.log('onValidate', markers);
          }}
          onMount={(editor, monaco) => {
            console.log('onMount', editor);
            console.log('monaco', monaco);

            const model = editor.getModel();

            if (!model) {
              console.error('No model found');
              return;
            }

            setMonacoInstance(monaco);
            setTextModel(model);
          }}
        />
      </Box>
    </div>
  );
};
