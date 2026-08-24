import type { EditorProps, Monaco } from "@monaco-editor/react";
import { Box, Skeleton, useColorScheme } from "@mui/material";
import type { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import React from "react";

import { useDeferredClientMount } from "#/shared/hooks/useDeferredClientMount";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="400px" />,
});

type CodeRunnerProps = EditorProps & {
  isUpdating?: boolean;
  setMonacoInstance?: React.Dispatch<React.SetStateAction<Monaco | null>>;
  setEditorInstance?: React.Dispatch<
    React.SetStateAction<editor.IStandaloneCodeEditor | null>
  >;
  setTextModel: React.Dispatch<React.SetStateAction<editor.ITextModel | null>>;
  /** Clears parent-held Monaco refs when the shell unmounts or Activity hides the route. */
  onEditorUnmount?: () => void;
};

type MonacoEditorShellInnerProps = CodeRunnerProps;

const MonacoEditorShellInner: React.FC<MonacoEditorShellInnerProps> = ({
  onEditorUnmount,
  setMonacoInstance,
  setEditorInstance,
  setTextModel,
  height,
  ...restProps
}) => {
  const { mode } = useColorScheme();
  const isMobile = useMobileLayout();
  const isReady = useDeferredClientMount(onEditorUnmount);

  const resolvedHeight =
    typeof height === "number" ? `calc(${height}px - 6vh)` : height;

  return (
    <Box
      sx={{
        position: "relative",
        height: height === "100%" ? "100%" : undefined,
      }}
    >
      {!isReady ? (
        <Skeleton
          variant="rectangular"
          height={resolvedHeight ?? "400px"}
          sx={{ width: "100%" }}
        />
      ) : (
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
          height={resolvedHeight}
          onMount={(mountedEditor, monaco) => {
            const model = mountedEditor.getModel();

            if (!model) {
              console.error("No model found");
              return;
            }

            setEditorInstance?.(mountedEditor);
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

            monaco.editor.setTheme("app-dark");
          }}
        />
      )}
    </Box>
  );
};

/**
 * Monaco wrapper for the playground code panel.
 * Defers mount one frame, disposes on Activity hide/unmount, and clears parent refs.
 */
export const CodeRunner: React.FC<CodeRunnerProps> = (props) => {
  return <MonacoEditorShellInner {...props} />;
};
