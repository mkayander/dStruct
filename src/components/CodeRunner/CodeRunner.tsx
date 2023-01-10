import type { EditorProps } from '@monaco-editor/react';
import { DeleteForever, PlayArrow, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import type { BinaryTreeNode } from '#/hooks/useBinaryTree';

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

  useEffect(() => {
    const savedCode = localStorage.getItem('code');
    if (savedCode) setCodeInput(savedCode);
  }, []);

  const [codeInput, setCodeInput] = useState<string>(defaultJsTemplate);

  const [codeResult, setCodeResult] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

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
      setError(null);

      setCodeResult(result);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
      console.log(e);
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
        'error',
        [] // clear markers
      );
      return;
    }

    const errorLine = error.split(' ')[1];
    if (!errorLine) return;
    const errorLineNumber = parseInt(errorLine, 10) - 1;

    console.log({ errorLine, errorLineNumber });

    // const errorRange = textModel.getFullModelRange();
    const errorPosition = textModel.getPositionAt(errorLineNumber);
    const errorPositionRange = textModel.getWordAtPosition(errorPosition);

    monacoInstance.editor.setModelMarkers(textModel, 'owner', [
      {
        severity: monacoInstance.MarkerSeverity.Error,
        startLineNumber: 1,
        startColumn: errorPositionRange?.startColumn || 1,
        endLineNumber: 1,
        endColumn: errorPositionRange?.endColumn || 1,
        message: error,
        source: 'source',
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
        <MonacoEditor
          height="80vh"
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'vs-light'}
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
