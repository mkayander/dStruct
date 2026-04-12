import AutoFixHigh from "@mui/icons-material/AutoFixHigh";
import ContentCopy from "@mui/icons-material/ContentCopy";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { TabContext, TabList } from "@mui/lab";
import {
  Box,
  Button,
  IconButton,
  type SelectChangeEvent,
  Stack,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import type * as monaco from "monaco-editor";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  callstackSlice,
  selectCallstackError,
  selectPlaybackSourceLine,
} from "#/features/callstack/model/callstackSlice";
import {
  getCodeKey,
  isLanguageValid,
  type ProgrammingLanguage,
  useCodeExecution,
} from "#/features/codeRunner/hooks/useCodeExecution";
import { useJavaScriptFormatCode } from "#/features/codeRunner/hooks/useJavaScriptFormatCode";
import { usePythonFormatCode } from "#/features/codeRunner/hooks/usePythonFormatCode";
import { codePrefixLinesCount } from "#/features/codeRunner/lib/setGlobalRuntimeContext";
import prettierIcon from "#/features/codeRunner/ui/assets/prettierIcon.svg";
import { CodeRunner } from "#/features/codeRunner/ui/CodeRunner";
import { EditorLanguageSelect } from "#/features/codeRunner/ui/EditorLanguageSelect";
import {
  EditorState,
  EditorStateIcon,
} from "#/features/codeRunner/ui/EditorStateIcon";
import { SolutionSelectBar } from "#/features/codeRunner/ui/SolutionSelectBar";
import {
  projectSlice,
  selectIsEditable,
} from "#/features/project/model/projectSlice";
import { selectIsEditingNodes } from "#/features/treeViewer/model/editorSlice";
import { api } from "#/shared/api";
import {
  useI18nContext,
  useMobileLayout,
  usePlaygroundSlugs,
  useSearchParam,
} from "#/shared/hooks";
import { LoadingSkeletonOverlay } from "#/shared/ui/atoms/LoadingSkeletonOverlay";
import { SolutionComplexityLabel } from "#/shared/ui/atoms/SolutionComplexityLabel";
import { PanelWrapper } from "#/shared/ui/templates/PanelWrapper";
import { type PanelContentProps } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout";
import { StyledTabPanel } from "#/shared/ui/templates/StyledTabPanel";
import { TabListWrapper } from "#/shared/ui/templates/TabListWrapper";
import { useAppDispatch, useAppSelector, useAppStore } from "#/store/hooks";

type CodePanelProps = PanelContentProps & {
  onRunComplete?: () => void;
};

export const CodePanel: React.FC<CodePanelProps> = ({
  verticalSize,
  onRunComplete,
}) => {
  const dispatch = useAppDispatch();
  const session = useSession();
  const trpcUtils = api.useUtils();
  const changeTimeoutId = useRef<ReturnType<typeof setTimeout>>(null);

  const { LL } = useI18nContext();
  const isMobile = useMobileLayout();

  const [runMode, setRunMode] = useSearchParam<"structure" | "benchmark">(
    "mode",
    {
      defaultValue: "structure",
      validate: (rawMode): rawMode is "structure" | "benchmark" =>
        rawMode === "structure" || rawMode === "benchmark",
    },
  );
  const [language, setLanguage] = useSearchParam<ProgrammingLanguage>(
    "language",
    {
      defaultValue: "javascript",
      validate: isLanguageValid,
    },
  );
  const [tabValue, setTabValue] = useState("1");
  const [codeInput, setCodeInput] = useState("");
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(
    null,
  );
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(
    null,
  );
  const [editorState, setEditorState] = useState(EditorState.INITIAL);
  const [isFormattingAvailable, setIsFormattingAvailable] = useState(true);
  /** True while a format request is in flight for the current generation (see formatGenerationRef). */
  const [formatUiPending, setFormatUiPending] = useState(false);

  /** Bumped to invalidate in-flight format when the user edits or switches language. */
  const formatGenerationRef = useRef(0);
  /** When true, editor updates come from applying formatted code — do not cancel format. */
  const skipFormatCancelRef = useRef(false);

  const { projectSlug = "", solutionSlug = "" } = usePlaygroundSlugs();
  const isEditable = useAppSelector(selectIsEditable);
  const isEditingNodes = useAppSelector(selectIsEditingNodes);
  const error = useAppSelector(selectCallstackError);
  const playbackSourceLine = useAppSelector(selectPlaybackSourceLine);
  const store = useAppStore();
  const playbackDecorationsRef = useRef<string[]>([]);

  const selectedProject = api.project.getBySlug.useQuery(projectSlug || "", {
    enabled: Boolean(projectSlug),
  });
  const currentSolution = api.project.getSolutionBySlug.useQuery(
    {
      projectId: selectedProject.data?.id || "",
      slug: solutionSlug,
    },
    {
      enabled: Boolean(selectedProject.data?.id && solutionSlug),
    },
  );

  const updateSolution = api.project.updateSolution.useMutation();

  const { enqueueSnackbar } = useSnackbar();

  const { isProcessing, runCode, runBenchmark } = useCodeExecution(
    codeInput,
    language || "javascript",
  );

  // Reset to run mode when switching to Python (benchmark is JS-only)
  useEffect(() => {
    if (language === "python" && runMode === "benchmark") {
      setRunMode("structure");
    }
  }, [language, runMode, setRunMode]);

  const formatJavaScript = useJavaScriptFormatCode();
  const formatPython = usePythonFormatCode();

  const cancelInFlightFormatting = useCallback(() => {
    formatGenerationRef.current += 1;
    setFormatUiPending(false);
    formatJavaScript.reset();
    formatPython.reset();
  }, [formatJavaScript, formatPython]);

  // Update code on solution change
  useEffect(() => {
    if (!currentSolution.data) return;
    cancelInFlightFormatting();
    if (!isFormattingAvailable) setIsFormattingAvailable(true);

    dispatch(projectSlice.actions.loadFinish());

    const key = getCodeKey(language);
    const newCode = currentSolution.data[key] ?? "";

    setEditorState(EditorState.INITIAL);
    if (textModel && !textModel.isDisposed()) {
      textModel.setValue(newCode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- load editor when solution slug/language/model changes; avoid re-running on unrelated state
  }, [
    cancelInFlightFormatting,
    currentSolution.data?.slug,
    language,
    textModel,
  ]);

  // Handle code errors
  useEffect(() => {
    if (!monacoInstance || !textModel || textModel.isDisposed()) return;
    if (!error) {
      monacoInstance.editor.setModelMarkers(
        textModel,
        "javascript",
        [], // clear markers
      );
      return;
    }

    let startLineNumber = 3;
    let endLineNumber = 9;
    let startColumn = 1;
    let endColumn = 10;

    const [, posLine] = error.stack?.split("\n") ?? [];

    if (posLine) {
      const [, strLine, strColumn] = posLine.match(/:(\d+):(\d+)\)$/) ?? [];
      const line = Number(strLine) - 2 - codePrefixLinesCount;
      const column = Number(strColumn);

      if (line && column) {
        startLineNumber = line;
        endLineNumber = startLineNumber;
        startColumn = column;
        endColumn = column + 32;

        // set cursor position
        if (editorInstance) {
          editorInstance.setPosition({ lineNumber: line, column });
          editorInstance.revealLineInCenterIfOutsideViewport(line);
        }
      }
    }

    if (!textModel.isDisposed()) {
      monacoInstance.editor.setModelMarkers(textModel, "javascript", [
        {
          severity: monacoInstance.MarkerSeverity.Error,
          message: `${error.name}: ${error.message}`,
          startLineNumber,
          endLineNumber,
          startColumn,
          endColumn,
        },
      ]);
    }
  }, [editorInstance, error, monacoInstance, textModel]);

  // Callstack playback: highlight current source line (cleared when buffer diverges from last run)
  useEffect(() => {
    if (
      !editorInstance ||
      !monacoInstance ||
      !textModel ||
      textModel.isDisposed()
    ) {
      return;
    }

    const line = playbackSourceLine;
    const nextDecorations =
      line != null && line >= 1 && line <= textModel.getLineCount()
        ? [
            {
              range: new monacoInstance.Range(line, 1, line, 1),
              options: {
                isWholeLine: true,
                className: "dstruct-editor-playback-line",
              },
            },
          ]
        : [];

    try {
      if (editorInstance.getModel() !== textModel) {
        playbackDecorationsRef.current = [];
        return;
      }
      playbackDecorationsRef.current = editorInstance.deltaDecorations(
        playbackDecorationsRef.current,
        nextDecorations,
      );
    } catch {
      playbackDecorationsRef.current = [];
    }
  }, [editorInstance, monacoInstance, playbackSourceLine, textModel]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    cancelInFlightFormatting();
    setLanguage(event.target.value);
  };

  const handleRunCode = async () => {
    const run = runMode === "benchmark" ? runBenchmark : runCode;
    const result = await run();
    if (runMode === "benchmark") {
      console.log("Worker: bench result: ", result);
    }
    if (result) {
      onRunComplete?.();
    }
  };

  const updateSolutionOnServer = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    const range = ev.changes[0]?.rangeLength ?? 0;
    if (session.status === "unauthenticated" && range > 0 && range < 200) {
      setEditorState(EditorState.FORKED_UNAUTHENTICATED);
    } else if (
      projectSlug &&
      solutionSlug &&
      isEditable &&
      currentSolution.data
    ) {
      setEditorState(EditorState.PENDING_CHANGES);

      const key = getCodeKey(language);

      clearTimeout(changeTimeoutId.current ?? undefined);
      const newTimeout = (changeTimeoutId.current = setTimeout(async () => {
        const data = await updateSolution.mutateAsync({
          projectId: currentSolution.data.projectId,
          solutionId: currentSolution.data.id,
          [key]: value,
        });
        if (newTimeout === changeTimeoutId.current) {
          trpcUtils.project.getSolutionBySlug.setData(
            {
              projectId: data.projectId,
              slug: data.slug,
            },
            data,
          );
          setEditorState(EditorState.SAVED_ON_SERVER);
        }
      }, 750));
    }
  };

  const handleChangeCode = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setCodeInput(value ?? "");
    if (!isFormattingAvailable) setIsFormattingAvailable(true);

    if (!ev.isFlush && !skipFormatCancelRef.current) {
      cancelInFlightFormatting();
    }

    // Only update the solution on server if it was a user edit
    if (ev.isFlush) {
      return;
    }

    const nextText = value ?? "";
    const { isReady, lastRunCodeSource } = store.getState().callstack;
    if (
      isReady &&
      lastRunCodeSource != null &&
      nextText !== lastRunCodeSource
    ) {
      dispatch(callstackSlice.actions.markCodeSnapshotStale());
    }

    updateSolutionOnServer(value, ev);
  };

  const applyFormattedCode = (formatted: string) => {
    if (!textModel) return;
    skipFormatCancelRef.current = true;
    try {
      const edit: monaco.editor.IIdentifiedSingleEditOperation = {
        range: textModel.getFullModelRange(),
        text: formatted,
      };
      textModel.pushEditOperations([], [edit], () => null);
      editorInstance?.setPosition({ lineNumber: 1, column: 1 });
    } finally {
      queueMicrotask(() => {
        skipFormatCancelRef.current = false;
      });
    }
  };

  const handleFormatCode = async () => {
    const gen = ++formatGenerationRef.current;
    setFormatUiPending(true);
    try {
      if (language === "javascript") {
        const formatted = await formatJavaScript.mutateAsync(codeInput);
        if (gen !== formatGenerationRef.current) return;
        applyFormattedCode(formatted);
        dispatch(callstackSlice.actions.markCodeSnapshotStale());
      } else if (language === "python") {
        const formatted = await formatPython.mutateAsync(codeInput);
        if (gen !== formatGenerationRef.current) return;
        applyFormattedCode(formatted);
        dispatch(callstackSlice.actions.markCodeSnapshotStale());
      }
    } catch (error) {
      if (gen === formatGenerationRef.current) {
        console.error("Error formatting code:", error);
        enqueueSnackbar("Failed to format code", { variant: "error" });
      }
    } finally {
      // Only the latest in-flight format clears loading (double-click starts a new gen).
      if (gen === formatGenerationRef.current) {
        setIsFormattingAvailable(false);
        setFormatUiPending(false);
      }
    }
  };

  const copyCode = () => {
    void navigator.clipboard.writeText(codeInput);
    enqueueSnackbar(`${LL.CODE_COPIED_TO_CLIPBOARD()} 🧑‍💻`, {
      variant: "success",
    });
  };

  const isLoading =
    selectedProject.isLoading ||
    currentSolution.isLoading ||
    updateSolution.isPending;

  const editorHeight: number | string = verticalSize
    ? verticalSize * 9 * (window.innerHeight / 1010)
    : "100%";

  return (
    <PanelWrapper
      onKeyDown={(ev) => {
        if (ev.code === "KeyS" && ev.ctrlKey) {
          ev.preventDefault();
          handleRunCode();
        }
      }}
    >
      <LoadingSkeletonOverlay />

      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label={LL.PANEL_TABS()}>
            <Tab label={LL.CODE_RUNNER()} value="1" />
          </TabList>
          <Stack direction="row" alignItems="center" spacing={1}>
            {isMobile && (
              <ToggleButtonGroup
                value={runMode}
                exclusive
                onChange={(_, value) => {
                  if (value) setRunMode(value);
                }}
                size="small"
              >
                <ToggleButton
                  value="structure"
                  aria-label="Structure"
                  title="Structure"
                >
                  Struct
                </ToggleButton>
                <ToggleButton
                  value="benchmark"
                  aria-label="Benchmark"
                  title="Benchmark"
                  disabled={language !== "javascript"}
                >
                  Bench
                </ToggleButton>
              </ToggleButtonGroup>
            )}
            <Button
              variant="text"
              color="success"
              title={LL.RUN_CODE()}
              disabled={isEditingNodes}
              endIcon={<PlayArrow />}
              loading={isProcessing}
              loadingPosition="end"
              onClick={handleRunCode}
              sx={{ height: "100%", borderRadius: "0 8px 0 0" }}
            >
              {LL.RUN()}
            </Button>
          </Stack>
        </TabListWrapper>
        <StyledTabPanel
          value="1"
          useScroll={false}
          scrollContainerStyle={{ zIndex: 1000, overflowY: "hidden" }}
          scrollViewportStyle={{ zIndex: 100, overflowY: "hidden" }}
          sx={{
            p: 0,
            overflowY: "hidden",
            flex: { xs: 1, sm: "unset" },
            minHeight: { xs: 0, sm: "unset" },
            height: { xs: "auto", sm: "unset" },
          }}
        >
          <Box
            mx={2}
            my={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <SolutionSelectBar selectedProject={selectedProject} />

            <SolutionComplexityLabel solution={currentSolution} />
          </Box>
          <Box
            sx={{
              position: "relative",
              flex: { xs: 1, sm: "unset" },
              minHeight: { xs: 0, sm: "unset" },
            }}
          >
            <CodeRunner
              language={language}
              height={editorHeight}
              value={codeInput}
              onChange={handleChangeCode}
              isUpdating={isLoading}
              setMonacoInstance={setMonacoInstance}
              setEditorInstance={setEditorInstance}
              setTextModel={setTextModel}
            />
            <Stack
              spacing={1}
              sx={{
                position: "absolute",
                top: "6px",
                right: "20px",
                opacity: 0.7,
                alignItems: "end",
              }}
            >
              <Tooltip title="Programming Language" arrow placement="left">
                <Box>
                  <EditorLanguageSelect
                    language={language}
                    handleLanguageChange={handleLanguageChange}
                  />
                </Box>
              </Tooltip>
              <EditorStateIcon
                state={editorState}
                isLoading={updateSolution.isPending}
              />
              <Tooltip
                title={LL.COPY_CODE_TO_CLIPBOARD()}
                arrow
                placement="left"
              >
                <IconButton
                  onClick={copyCode}
                  style={{ marginRight: "-6px", marginTop: "2px" }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  <Box display="flex" alignItems="center" gap="3px">
                    {language === "javascript" ? (
                      <>
                        {LL.FORMAT_CODE_WITH()} <b>Prettier</b>{" "}
                        <Image
                          src={prettierIcon}
                          alt={`'Prettier' ${LL.FORMATTING_ICON()}`}
                          width={22}
                          height={22}
                        />
                      </>
                    ) : language === "python" ? (
                      <span>{LL.FORMAT_CODE_WITH_BLACK()}</span>
                    ) : (
                      <span>
                        Formatting is only available for JavaScript and Python
                      </span>
                    )}
                  </Box>
                }
                arrow
                placement="left"
              >
                <IconButton
                  disabled={
                    !isFormattingAvailable ||
                    (language !== "javascript" && language !== "python")
                  }
                  loading={formatUiPending}
                  onClick={handleFormatCode}
                  style={{ marginRight: "-6px", marginTop: "2px" }}
                >
                  <AutoFixHigh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
