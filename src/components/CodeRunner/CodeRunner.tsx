import type { EditorProps } from '@monaco-editor/react';
import { AutoFixHigh, PlayArrow } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Tooltip,
  useTheme,
} from '@mui/material';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import parserBabel from 'prettier/parser-babel';
import prettier from 'prettier/standalone';
import React, { useContext, useEffect, useState } from 'react';

import { PlaygroundRuntimeContext } from '#/context';
import { trpc } from '#/utils';

import { useAppDispatch, useAppSelector } from '#/store/hooks';
import {
  callstackSlice,
  selectRuntimeData,
} from '#/store/reducers/callstackReducer';
import {
  selectCurrentProjectId,
  selectCurrentSolutionId,
} from '#/store/reducers/projectReducer';
import { treeNodeSlice } from '#/store/reducers/treeNodeReducer';

import prettierIcon from './assets/prettierIcon.svg';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <CircularProgress />,
});

type CodeRunnerProps = EditorProps;

export const CodeRunner: React.FC<CodeRunnerProps> = ({ ...restProps }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(selectRuntimeData);

  const { tree } = useContext(PlaygroundRuntimeContext);

  useEffect(() => {
    const savedCode = localStorage.getItem('code');
    if (savedCode) setCodeInput(savedCode);
  }, []);

  const [codeInput, setCodeInput] = useState<string>('');

  const currentProjectId = useAppSelector(selectCurrentProjectId) ?? '';
  const currentSolutionId = useAppSelector(selectCurrentSolutionId) ?? '';

  const trpcUtils = trpc.useContext();

  const currentSolution = trpc.project.getSolutionById.useQuery(
    {
      id: currentSolutionId,
      projectId: currentProjectId,
    },
    {
      enabled: Boolean(currentProjectId && currentSolutionId),
    }
  );

  const updateSolution = trpc.project.updateSolution.useMutation();

  useEffect(() => {
    if (currentSolution.data?.code) setCodeInput(currentSolution.data.code);
  }, [currentSolution.data]);

  useEffect(() => {
    if (error || !currentProjectId || !currentSolutionId) return;

    const timeoutId = setTimeout(() => {
      updateSolution.mutate(
        {
          projectId: currentProjectId,
          solutionId: currentSolutionId,
          code: codeInput,
        },
        {
          onSuccess: (data) => {
            trpcUtils.project.getSolutionById.setData(data, (input) => input);
          },
        }
      );
    }, 750);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeInput, error]);

  const handleFormatCode = () => {
    const formattedCode = prettier.format(codeInput, {
      parser: 'babel',
      plugins: [parserBabel],
    });
    setCodeInput(formattedCode);
  };

  const handleRunCode = () => {
    console.log('Run code:\n', codeInput);

    const getInputFunction = new Function(codeInput);

    let runtime = performance.now();

    try {
      const runFunction = getInputFunction();
      console.log('Run function:\n', runFunction);

      // Before running the code, clear the callstack
      dispatch(callstackSlice.actions.removeAll());
      dispatch(treeNodeSlice.actions.resetAll()); // Reset all nodes to default

      const result = runFunction(tree);
      runtime = performance.now() - runtime;

      console.log('Runtime: ', runtime);

      // Identify that the callstack is filled and can now be used
      dispatch(
        callstackSlice.actions.setStatus({
          isReady: true,
          error: null,
          result,
          runtime,
        })
      );

      console.log('Result:\n', result);
    } catch (e: unknown) {
      runtime = performance.now() - runtime;
      if (e instanceof Error) {
        dispatch(
          callstackSlice.actions.setStatus({
            isReady: true,
            error: e,
            result: null,
            runtime,
          })
        );
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
        justifyContent="flex-end"
        mb={2}
        gap={1}
      >
        <Box display="flex" columnGap={2}>
          <Tooltip
            title={
              <Box display="flex" alignItems="center" gap="3px">
                Format code with <b>Prettier</b>{' '}
                <Image
                  alt="'Prettier' formatting icon"
                  {...prettierIcon}
                  width={22}
                  height={22}
                />
              </Box>
            }
            arrow
          >
            <IconButton onClick={handleFormatCode} size="small">
              <AutoFixHigh fontSize="small" />
            </IconButton>
          </Tooltip>
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
      <Box position="relative" boxShadow={8} borderRadius={1} overflow="hidden">
        <LinearProgress
          sx={{
            position: 'absolute',
            width: '100%',
            zIndex: 10,
            transition: 'opacity .2s',
            opacity: updateSolution.isLoading ? 1 : 0,
          }}
        />
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
          onMount={(editor, monaco) => {
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
