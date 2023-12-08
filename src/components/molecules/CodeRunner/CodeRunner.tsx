import type { EditorProps } from "@monaco-editor/react";
import { Box, Skeleton, useTheme } from "@mui/material";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import dynamic from "next/dynamic";
import React from "react";

import { useMobileLayout } from "#/hooks/useMobileLayout";

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
  height,
  ...restProps
}) => {
  const theme = useTheme();
  const isMobile = useMobileLayout();

  return (
    <Box position="relative">
      <MonacoEditor
        theme={theme.palette.mode === "dark" ? "app-dark" : "vs-light"}
        options={{
          minimap: { enabled: false },
          tabSize: 2,
          fixedOverflowWidgets: true,
          lineNumbersMinChars: 3,
          lineDecorationsWidth: 6,
          folding: !isMobile,
        }}
        {...restProps}
        height={`calc(${height}px - 6vh)`}
        language="javascript"
        onMount={(editor, monaco) => {
          const model = editor.getModel();

          if (!model) {
            console.error("No model found");
            return;
          }

          setEditorInstance?.(editor);
          setMonacoInstance?.(monaco);
          setTextModel(model);

          monaco.editor.defineTheme("app-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
              "editor.background": "#00000000",
            },
          });

          // set app-dark theme
          monaco.editor.setTheme("app-dark");
        }}
      />
    </Box>
  );
};
