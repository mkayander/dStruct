import type { EditorProps } from '@monaco-editor/react';
import { CircularProgress, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';

export { default as defaultJsTemplate } from './defaultTemplate.js.txt';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <CircularProgress />,
});

type CodeEditorProps = EditorProps;

export const CodeEditor: React.FC<CodeEditorProps> = ({ ...restProps }) => {
  const theme = useTheme();

  return (
    <MonacoEditor
      height="80vh"
      theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'vs-light'}
      language="javascript"
      {...restProps}
    />
  );
};
