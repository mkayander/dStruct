import type { EditorProps } from "@monaco-editor/react";
import { Box, LinearProgress, Skeleton, useTheme } from "@mui/material";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import dynamic from "next/dynamic";
import React from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="400px" />,
});

type CodeRunnerProps = EditorProps & {
  isUpdating?: boolean;
  setMonacoInstance?: React.Dispatch<
    React.SetStateAction<typeof monaco | null>
  >;
  setEditorInstance?: React.Dispatch<
    React.SetStateAction<monaco.editor.IStandaloneCodeEditor | null>
  >;
  setTextModel: React.Dispatch<
    React.SetStateAction<monaco.editor.ITextModel | null>
  >;
};

export const CodeRunner: React.FC<CodeRunnerProps> = ({
  isUpdating,
  setMonacoInstance,
  setEditorInstance,
  setTextModel,
  ...restProps
}) => {
  const theme = useTheme();

  return (
    <Box position="relative" boxShadow={4} borderRadius={1}>
      <LinearProgress
        sx={{
          position: "absolute",
          width: "100%",
          transition: "opacity .2s",
          opacity: isUpdating ? 1 : 0,
        }}
      />
      <MonacoEditor
        height="400px"
        theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
        options={{
          minimap: { enabled: false },
          tabSize: 2,
          fixedOverflowWidgets: true,
        }}
        {...restProps}
        language="javascript"
        loading={
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={400}
            width="100%"
          />
        }
        onMount={(editor, monaco) => {
          const model = editor.getModel();

          if (!model) {
            console.error("No model found");
            return;
          }

          setEditorInstance?.(editor);
          setMonacoInstance?.(monaco);
          setTextModel(model);
        }}
      />
    </Box>
  );
};
