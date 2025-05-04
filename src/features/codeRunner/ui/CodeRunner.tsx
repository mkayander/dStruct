import type { EditorProps } from "@monaco-editor/react";
import { Box, Skeleton, useColorScheme } from "@mui/material";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import dynamic from "next/dynamic";
import React from "react";

import { useMobileLayout } from "#/shared/hooks/useMobileLayout";

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
  setMonacoInstance,
  setEditorInstance,
  setTextModel,
  height,
  ...restProps
}) => {
  const { mode } = useColorScheme();
  const isMobile = useMobileLayout();

  return (
    <Box position="relative">
      <MonacoEditor
        theme={mode === "dark" ? "app-dark" : "vs-light"}
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          tabSize: 2,
          fixedOverflowWidgets: true,
          lineNumbersMinChars: 3,
          lineDecorationsWidth: 6,
          folding: !isMobile,
          stickyScroll: { enabled: false },
          wordWrap: "on",
        }}
        {...restProps}
        height={`calc(${height}px - 6vh)`}
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
              focusBorder: "#00000000",
            },
          });

          // set app-dark theme
          monaco.editor.setTheme("app-dark");
        }}
      />
    </Box>
  );
};
